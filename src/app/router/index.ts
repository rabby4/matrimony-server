import express from "express"
import { authRoutes, legacyJwtRoutes } from "../modules/auth/auth.routes"
import { userRoutes } from "../modules/user/user.routes"
import { favoriteRoutes } from "../modules/favorite/favorite.routes"
import { paymentRoutes } from "../modules/payment/payment.routes"
import { storyRoutes } from "../modules/story/story.routes"

const router = express.Router()

// Paths are kept identical to the original API so the current client
// keeps working without changes.
const moduleRoutes = [
	{
		// register + login (email/password, returns access token)
		path: "/auth",
		route: authRoutes,
	},
	{
		// legacy token endpoint for the Firebase-authenticated client
		path: "/jwt",
		route: legacyJwtRoutes,
	},
	{
		path: "/users",
		route: userRoutes,
	},
	{
		path: "/favorites",
		route: favoriteRoutes,
	},
	{
		path: "/success-stories",
		route: storyRoutes,
	},
	{
		// payment endpoints live at the root: /create-payment-intent,
		// /payments, /payment/:id
		path: "/",
		route: paymentRoutes,
	},
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
