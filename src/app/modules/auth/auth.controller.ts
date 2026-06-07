import status from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { authServices } from "./auth.service"

const register = catchAsync(async (req, res) => {
	const result = await authServices.register(req.body)
	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: "User registered successfully!",
		data: result,
	})
})

const login = catchAsync(async (req, res) => {
	const result = await authServices.login(req.body)
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: "User logged in successfully!",
		data: result,
	})
})

const firebaseLogin = catchAsync(async (req, res) => {
	const result = await authServices.firebaseLogin(req.body.idToken)
	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: "User logged in successfully!",
		data: result,
	})
})

// Legacy: response shape kept as { token } — the current client stores it
// in localStorage.
const createToken = catchAsync(async (req, res) => {
	const result = authServices.createToken(req.body.email)
	res.send(result)
})

export const authController = {
	register,
	login,
	firebaseLogin,
	createToken,
}
