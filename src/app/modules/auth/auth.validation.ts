import { z } from "zod"

const register = z.looseObject({
	name: z.string({ error: "Name is required" }).min(1, "Name is required"),
	email: z.email("A valid email is required"),
	password: z
		.string({ error: "Password is required" })
		.min(6, "Password must be at least 6 characters"),
	photo: z.string().optional(),
})

const login = z.object({
	email: z.email("A valid email is required"),
	password: z.string({ error: "Password is required" }),
})

const firebaseLogin = z.object({
	idToken: z
		.string({ error: "idToken is required" })
		.min(1, "idToken is required"),
})

// Legacy: POST /jwt for the current Firebase-authenticated client.
const loginPayload = z.looseObject({
	email: z.email("A valid email is required"),
})

export const authValidation = {
	register,
	login,
	firebaseLogin,
	loginPayload,
}
