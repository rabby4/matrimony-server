import status from "http-status"
import catchAsync from "../../../shared/catchAsync"
import ApiError from "../../errors/ApiError"
import { userServices } from "./user.service"

const createUser = catchAsync(async (req, res) => {
	const result = await userServices.createUser(req.body)
	res.send(result)
})

const getAllUsers = catchAsync(async (req, res) => {
	const result = await userServices.getAllUsers()
	res.send(result)
})

const getSingleUser = catchAsync(async (req, res) => {
	const result = await userServices.getSingleUser(
		req.params.identifier as string
	)
	res.send(result)
})

const updateBiodata = catchAsync(async (req, res) => {
	const result = await userServices.updateBiodata(
		req.params.id as string,
		req.body
	)
	res.send(result)
})

const updatePremium = catchAsync(async (req, res) => {
	const result = await userServices.updatePremium(
		req.params.id as string,
		req.body.premium
	)
	res.send(result)
})

const makeAdmin = catchAsync(async (req, res) => {
	const result = await userServices.makeAdmin(req.params.id as string)
	res.send(result)
})

const isAdmin = catchAsync(async (req, res) => {
	// A user may only ask about their own admin status.
	if (req.user?.email !== req.params.email) {
		throw new ApiError(status.FORBIDDEN, "Forbidden access!")
	}
	const result = await userServices.isAdmin(req.params.email)
	res.send(result)
})

export const userController = {
	createUser,
	getAllUsers,
	getSingleUser,
	updateBiodata,
	updatePremium,
	makeAdmin,
	isAdmin,
}
