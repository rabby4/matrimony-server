import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { paymentValidation } from "./payment.validation"
import { paymentController } from "./payment.controller"

// Mounted at the app root to preserve the original public paths
// (/create-payment-intent, /payments, /payment/:id).
const router = express.Router()

// POST /create-payment-intent — start a Stripe payment
router.post(
	"/create-payment-intent",
	auth(),
	validateRequest(paymentValidation.createPaymentIntent),
	paymentController.createPaymentIntent
)

// POST /payments — store a contact request after a successful payment
router.post(
	"/payments",
	auth(),
	validateRequest(paymentValidation.createPayment),
	paymentController.createPayment
)

// GET /payments — all contact requests (admin dashboard + revenue stats)
// NOTE: only auth() for now — the client's useRequested hook also runs this
// query for normal users; restrict to auth('admin') in the frontend phase.
router.get("/payments", auth(), paymentController.getAllPayments)

// GET /payments/:email — a user's own contact requests
router.get("/payments/:email", auth(), paymentController.getPaymentsByEmail)

// DELETE /payments/:id — cancel a contact request
// TODO: needs auth() + ownership check once the client sends the token here.
router.delete("/payments/:id", paymentController.deletePayment)

// PATCH /payment/:id — admin approves a contact request
router.patch(
	"/payment/:id",
	auth("admin"),
	validateRequest(paymentValidation.updateStatus),
	paymentController.updateStatus
)

export const paymentRoutes = router
