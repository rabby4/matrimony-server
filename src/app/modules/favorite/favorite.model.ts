import { Schema, model } from "mongoose"

// A favorite is a snapshot of another user's biodata plus the owner's email
// (userEmail). strict: false keeps the snapshot fields untouched.
const favoriteSchema = new Schema(
	{
		userEmail: { type: String, required: true },
	},
	{
		strict: false,
		versionKey: false,
		collection: "favorites",
	}
)

export const Favorite = model("Favorite", favoriteSchema)
