import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { userValidation } from "./user.validation"
import { userController } from "./user.controller"

const router = express.Router()

// POST /users — register a user (called right after Firebase signup/login)
router.post(
	"/",
	validateRequest(userValidation.createUser),
	userController.createUser
)

// GET /users — all biodata listings
// TODO: enforce auth + pagination once the client sends the token here.
router.get("/", userController.getAllUsers)

// GET /users/admin/:email — check admin status (client sends the JWT here)
router.get("/admin/:email", auth(), userController.isAdmin)

// PATCH /users/admin/:id — promote a user to admin
// TODO: must become auth('admin') once the client calls it via axiosSecure.
router.patch("/admin/:id", userController.makeAdmin)

// GET /users/:identifier — by ObjectId or email (replaces the old shadowed
// /users/:email + /users/:id pair)
router.get("/:identifier", userController.getSingleUser)

// PUT /users/:id — save/update biodata
// TODO: enforce auth + ownership once the client sends the token here.
router.put("/:id", userController.updateBiodata)

// PATCH /users/:id — toggle premium status
// TODO: must become auth('admin') once the client calls it via axiosSecure.
router.patch(
	"/:id",
	validateRequest(userValidation.updatePremium),
	userController.updatePremium
)

export const userRoutes = router
