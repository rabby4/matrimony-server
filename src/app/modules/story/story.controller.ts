import status from "http-status"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import ApiError from "../../errors/ApiError"
import { storyServices } from "./story.service"

const upsertStory = catchAsync(async (req, res) => {
	const userEmail = req.user?.email
	if (!userEmail) {
		throw new ApiError(status.UNAUTHORIZED, "You are not authorized!")
	}
	const result = await storyServices.upsertStory(userEmail, req.body)
	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: "Your success story has been saved!",
		data: result,
	})
})

const getAllStories = catchAsync(async (req, res) => {
	const result = await storyServices.getAllStories()
	// raw array — consistent with the other public list endpoints
	res.send(result)
})

export const storyController = {
	upsertStory,
	getAllStories,
}
