import { Schema, model } from "mongoose"

// A success story shared by a member after getting married through the platform.
const storySchema = new Schema(
	{
		userEmail: { type: String, required: true },
		selfBiodataId: { type: String },
		partnerBiodataId: { type: String },
		coupleImage: { type: String },
		marriageDate: { type: String },
		rating: { type: Number, min: 1, max: 5 },
		story: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
		collection: "successStories",
	}
)

export const SuccessStory = model("SuccessStory", storySchema)
