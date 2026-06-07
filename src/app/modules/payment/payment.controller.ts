import status from "http-status"
import catchAsync from "../../../shared/catchAsync"
import ApiError from "../../errors/ApiError"
import { paymentServices } from "./payment.service"

const createPaymentIntent = catchAsync(async (req, res) => {
	const result = await paymentServices.createPaymentIntent(req.body.price)
	res.send(result)
})

const createPayment = catchAsync(async (req, res) => {
	// A user can only create a contact request for themselves.
	if (req.user?.email !== req.body.requesterEmail) {
		throw new ApiError(status.FORBIDDEN, "Forbidden access!")
	}
	const result = await paymentServices.createPayment(req.body)
	// The client checks res.data.paymentResult.acknowledged.
	res.send({ paymentResult: result })
})

const getAllPayments = catchAsync(async (req, res) => {
	const result = await paymentServices.getAllPayments()
	res.send(result)
})

const getPaymentsByEmail = catchAsync(async (req, res) => {
	// A user may only read their own contact requests.
	if (req.user?.email !== req.params.email) {
		throw new ApiError(status.FORBIDDEN, "Forbidden access!")
	}
	const result = await paymentServices.getPaymentsByEmail(
		req.params.email as string
	)
	res.send(result)
})

const deletePayment = catchAsync(async (req, res) => {
	const result = await paymentServices.deletePayment(req.params.id as string)
	res.send(result)
})

const updateStatus = catchAsync(async (req, res) => {
	const result = await paymentServices.updateStatus(
		req.params.id as string,
		req.body.status
	)
	res.send(result)
})

export const paymentController = {
	createPaymentIntent,
	createPayment,
	getAllPayments,
	getPaymentsByEmail,
	deletePayment,
	updateStatus,
}
