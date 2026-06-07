import Stripe from "stripe"
import mongoose from "mongoose"
import status from "http-status"
import config from "../../../config"
import ApiError from "../../errors/ApiError"
import { Payment } from "./payment.model"

let stripeClient: Stripe | null = null
const getStripe = () => {
	if (!stripeClient) {
		if (!config.stripeSecretKey) {
			throw new ApiError(
				status.INTERNAL_SERVER_ERROR,
				"Stripe is not configured!"
			)
		}
		// This project only processes sandbox/test payments. A live key is
		// rejected unless explicitly opted in via ALLOW_LIVE_STRIPE=true.
		if (
			config.stripeSecretKey.startsWith("sk_live_") &&
			process.env.ALLOW_LIVE_STRIPE !== "true"
		) {
			throw new ApiError(
				status.INTERNAL_SERVER_ERROR,
				"A live Stripe key is configured, but this app only allows test mode! Set ALLOW_LIVE_STRIPE=true to override."
			)
		}
		stripeClient = new Stripe(config.stripeSecretKey)
	}
	return stripeClient
}

const createPaymentIntent = async (price: number) => {
	// Math.round avoids floating-point truncation (e.g. 19.99 * 100 = 1998.9999...)
	const amount = Math.round(price * 100)
	const paymentIntent = await getStripe().paymentIntents.create({
		amount,
		currency: "usd",
		payment_method_types: ["card"],
	})
	return { clientSecret: paymentIntent.client_secret }
}

const createPayment = async (payload: Record<string, unknown>) => {
	const created = await Payment.create(payload)
	return { acknowledged: true, insertedId: created._id }
}

const getAllPayments = async () => {
	return Payment.find().lean()
}

const getPaymentsByEmail = async (email: string) => {
	return Payment.find({ requesterEmail: email }).lean()
}

const deletePayment = async (id: string) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid payment id!")
	}
	return Payment.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
}

const updateStatus = async (id: string, newStatus: string) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid payment id!")
	}
	return Payment.updateOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ $set: { status: newStatus } }
	)
}

export const paymentServices = {
	createPaymentIntent,
	createPayment,
	getAllPayments,
	getPaymentsByEmail,
	deletePayment,
	updateStatus,
}
