import { Schema, model } from "mongoose"
import { IUser } from "./user.interface"

// strict: false + versionKey: false keep documents byte-compatible with the
// data written by the old native-driver implementation.
const userSchema = new Schema<IUser>(
	{
		name: { type: String },
		email: { type: String, required: true },
		// select: false — never returned by queries unless explicitly requested
		// with .select('+password'), so user listings can't leak hashes.
		password: { type: String, select: false },
		photo: { type: String },
		role: { type: String },
		premium: { type: Boolean },
	},
	{
		strict: false,
		versionKey: false,
		collection: "users",
	}
)

export const User = model<IUser>("User", userSchema)
