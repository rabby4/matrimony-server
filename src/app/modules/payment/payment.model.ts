import { Schema, model } from "mongoose"

// A contact request: the requester pays to see another member's contact info,
// then an admin approves it.
const paymentSchema = new Schema(
	{
		name: { type: String },
		bioDataId: { type: String },
		phone: { type: String },
		email: { type: String },
		price: { type: Number },
		requesterName: { type: String },
		requesterEmail: { type: String, required: true },
		requesterBioId: { type: String },
		status: { type: String, default: "Pending" },
	},
	{
		strict: false,
		versionKey: false,
		collection: "payments",
	}
)

export const Payment = model("Payment", paymentSchema)
