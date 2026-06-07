import { NextFunction, Request, Response } from "express"
import status from "http-status"
import mongoose from "mongoose"
import { ZodError } from "zod"
import ApiError from "../errors/ApiError"

const globalErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction
) => {
	let statusCode: number = status.INTERNAL_SERVER_ERROR
	let message = err.message || "Something went wrong!"
	let error: unknown = err.message

	if (err instanceof ZodError) {
		statusCode = status.BAD_REQUEST
		message = "Validation error!"
		error = err.issues.map((issue) => ({
			field: issue.path[issue.path.length - 1],
			message: issue.message,
		}))
	} else if (err instanceof ApiError) {
		statusCode = err.statusCode
		message = err.message
	} else if (err instanceof mongoose.Error.CastError) {
		statusCode = status.BAD_REQUEST
		message = `Invalid value for '${err.path}'!`
	} else if (err instanceof mongoose.Error.ValidationError) {
		statusCode = status.BAD_REQUEST
		message = "Validation error!"
		error = Object.values(err.errors).map((e) => e.message)
	}

	if (statusCode === status.INTERNAL_SERVER_ERROR) {
		// Log unexpected errors so they can be debugged in production.
		console.error(err)
	}

	res.status(statusCode).json({
		success: false,
		message,
		error,
	})
}

export default globalErrorHandler
