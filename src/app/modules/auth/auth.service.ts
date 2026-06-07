// bcryptjs is pure JavaScript (no native binary) — safe for serverless
// deploys built on a different OS than the runtime.
import bcrypt from "bcryptjs"
import status from "http-status"
import { Secret } from "jsonwebtoken"
import config from "../../../config"
import getFirebaseAdmin from "../../../helpers/firebaseAdmin"
import { jwtHelpers } from "../../../shared/jwtHelper"
import ApiError from "../../errors/ApiError"
import { User } from "../user/user.model"
import { IUser } from "../user/user.interface"

const SALT_ROUNDS = 12

const generateAccessToken = (email: string, role?: string) => {
	return jwtHelpers.generateToken(
		{ email, role },
		config.jwt.accessSecret as Secret,
		config.jwt.expiresIn
	)
}

// Strip fields that must never reach the client.
const sanitizeUser = (user: IUser & { _id: unknown }) => {
	const { password, ...rest } = user
	return rest
}

/**
 * Register a new user and log them in immediately — the response carries
 * the access token, so no separate login call is needed.
 */
const register = async (payload: IUser & { password: string }) => {
	const existUser = await User.findOne({ email: payload.email }).lean()
	if (existUser) {
		throw new ApiError(status.CONFLICT, "User already exists!")
	}

	const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS)

	const created = await User.create({
		...payload,
		password: hashedPassword,
		role: "user",
		premium: false,
	})

	const accessToken = generateAccessToken(created.email, "user")

	return {
		accessToken,
		user: sanitizeUser(created.toObject()),
	}
}

const login = async (payload: { email: string; password: string }) => {
	// password is select: false — request it explicitly for the comparison.
	const user = await User.findOne({ email: payload.email })
		.select("+password")
		.lean()

	if (!user) {
		throw new ApiError(status.UNAUTHORIZED, "Invalid email or password!")
	}

	if (!user.password) {
		throw new ApiError(
			status.BAD_REQUEST,
			"This account uses Google/Firebase sign-in. Please log in through the website."
		)
	}

	const isPasswordValid = await bcrypt.compare(payload.password, user.password)
	if (!isPasswordValid) {
		throw new ApiError(status.UNAUTHORIZED, "Invalid email or password!")
	}

	const accessToken = generateAccessToken(user.email, user.role)

	return {
		accessToken,
		user: sanitizeUser(user),
	}
}

/**
 * Log in with a Firebase ID token (from the client's getIdToken()).
 *
 * The token is cryptographically verified with the Firebase Admin SDK, so —
 * unlike the legacy POST /jwt — the caller must genuinely be signed in to
 * Firebase. The Firebase account is synced into MongoDB on first login
 * (covers Google sign-in users who never hit /auth/register), then our own
 * JWT is issued with the same response shape as /auth/login.
 */
const firebaseLogin = async (idToken: string) => {
	let decoded
	try {
		decoded = await getFirebaseAdmin().auth().verifyIdToken(idToken)
	} catch (error) {
		if (error instanceof ApiError) throw error
		throw new ApiError(status.UNAUTHORIZED, "Invalid Firebase ID token!")
	}

	if (!decoded.email) {
		throw new ApiError(
			status.BAD_REQUEST,
			"The Firebase account has no email address!"
		)
	}

	// Sync: create the user on first login, leave existing biodata untouched.
	let user = await User.findOne({ email: decoded.email }).lean()
	if (!user) {
		const created = await User.create({
			email: decoded.email,
			name: decoded.name,
			photo: decoded.picture,
			role: "user",
			premium: false,
		})
		user = created.toObject()
	}

	const accessToken = generateAccessToken(user.email, user.role)

	return {
		accessToken,
		user: sanitizeUser(user),
	}
}

// Legacy: issue a token for a Firebase-authenticated user (POST /jwt).
const createToken = (email: string) => {
	const token = jwtHelpers.generateToken(
		{ email },
		config.jwt.accessSecret as Secret,
		config.jwt.expiresIn
	)
	return { token }
}

export const authServices = {
	register,
	login,
	firebaseLogin,
	createToken,
}
