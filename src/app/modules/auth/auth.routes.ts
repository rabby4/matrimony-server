import express from "express"
import validateRequest from "../../middlewares/validateRequest"
import { authValidation } from "./auth.validation"
import { authController } from "./auth.controller"

const router = express.Router()

// POST /auth/register — create an account; responds with an access token
// (auto-login) plus the created user
router.post(
	"/register",
	validateRequest(authValidation.register),
	authController.register
)

// POST /auth/login — verify email + password; responds with an access token
router.post(
	"/login",
	validateRequest(authValidation.login),
	authController.login
)

// POST /auth/firebase-login — verify a Firebase ID token, sync the account
// into MongoDB, and respond with our access token (same shape as /login)
router.post(
	"/firebase-login",
	validateRequest(authValidation.firebaseLogin),
	authController.firebaseLogin
)

export const authRoutes = router

// Legacy: POST /jwt — issue a token for a Firebase-authenticated user.
// Kept until the client is migrated to /auth/login in the frontend phase.
const legacyRouter = express.Router()

legacyRouter.post(
	"/",
	validateRequest(authValidation.loginPayload),
	authController.createToken
)

export const legacyJwtRoutes = legacyRouter
