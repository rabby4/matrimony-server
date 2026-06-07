import { z } from "zod"

const createPaymentIntent = z.object({
	price: z
		.number({ error: "price must be a number" })
		.positive("price must be greater than 0"),
})

const createPayment = z.looseObject({
	requesterEmail: z.email("A valid requester email is required"),
	status: z.string().optional(),
})

const updateStatus = z.object({
	status: z.string({ error: "status is required" }),
})

export const paymentValidation = {
	createPaymentIntent,
	createPayment,
	updateStatus,
}
