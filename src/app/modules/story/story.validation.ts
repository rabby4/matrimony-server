import { z } from "zod"

const createStory = z.looseObject({
	partnerBiodataId: z
		.string({ error: "Partner biodata id is required" })
		.min(1, "Partner biodata id is required"),
	story: z
		.string({ error: "Story is required" })
		.min(20, "Please write at least 20 characters"),
	marriageDate: z.string().optional(),
	coupleImage: z.string().optional(),
	rating: z.number().min(1).max(5).optional(),
})

export const storyValidation = {
	createStory,
}
