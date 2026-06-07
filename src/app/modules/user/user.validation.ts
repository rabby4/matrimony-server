import { z } from "zod"

const createUser = z.looseObject({
	email: z.email("A valid email is required"),
	name: z.string().optional(),
	photo: z.string().optional(),
})

const updatePremium = z.object({
	premium: z.boolean({ error: "premium must be a boolean" }),
})

export const userValidation = {
	createUser,
	updatePremium,
}
