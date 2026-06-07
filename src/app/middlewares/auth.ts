import { NextFunction, Request, Response } from "express"
import { Secret } from "jsonwebtoken"
import status from "http-status"
import config from "../../config"
import { jwtHelpers } from "../../shared/jwtHelper"
import ApiError from "../errors/ApiError"
import { User } from "../modules/user/user.model"
import { IAuthUser } from "../interfaces/common"

/**
 * Verifies the JWT from the Authorization header (with or without the
 * "Bearer " prefix — the client sends "Bearer <token>").
 *
 * When roles are passed (e.g. auth('admin')), the requester's role is looked
 * up in the database, because the JWT payload only carries the email.
 */
const auth = (...roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authHeader = req.headers.authorization
			if (!authHeader) {
				throw new ApiError(status.UNAUTHORIZED, "You are not authorized!")
			}

			const token = authHeader.startsWith("Bearer ")
				? authHeader.split(" ")[1]
				: authHeader

			let verifiedUser
			try {
				verifiedUser = jwtHelpers.verifyToken(
					token,
					config.jwt.accessSecret as Secret
				)
			} catch {
				throw new ApiError(status.UNAUTHORIZED, "Invalid or expired token!")
			}

			req.user = verifiedUser as IAuthUser

			if (roles.length) {
				const dbUser = await User.findOne({
					email: verifiedUser.email,
				}).lean()
				const role = dbUser?.role || "user"
				if (!roles.includes(role)) {
					throw new ApiError(status.FORBIDDEN, "Forbidden access!")
				}
			}

			next()
		} catch (error) {
			next(error)
		}
	}
}

export default auth
