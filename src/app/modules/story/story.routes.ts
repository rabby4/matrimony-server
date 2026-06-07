import express from "express"
import auth from "../../middlewares/auth"
import validateRequest from "../../middlewares/validateRequest"
import { storyValidation } from "./story.validation"
import { storyController } from "./story.controller"

const router = express.Router()

// GET /success-stories — public list (home page "couples who found love")
router.get("/", storyController.getAllStories)

// POST /success-stories — share/update the member's own story
router.post(
	"/",
	auth(),
	validateRequest(storyValidation.createStory),
	storyController.upsertStory
)

export const storyRoutes = router
