import { SuccessStory } from "./story.model"

type IStoryPayload = {
	selfBiodataId?: string
	partnerBiodataId: string
	coupleImage?: string
	marriageDate?: string
	rating?: number
	story: string
}

/**
 * One story per member: re-submitting updates the existing story
 * instead of creating duplicates.
 */
const upsertStory = async (userEmail: string, payload: IStoryPayload) => {
	return SuccessStory.findOneAndUpdate(
		{ userEmail },
		{ $set: { ...payload, userEmail } },
		{ upsert: true, new: true }
	).lean()
}

const getAllStories = async () => {
	return SuccessStory.find().sort({ createdAt: -1 }).lean()
}

export const storyServices = {
	upsertStory,
	getAllStories,
}
