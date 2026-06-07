import mongoose from "mongoose"
import status from "http-status"
import ApiError from "../../errors/ApiError"
import { IUser } from "./user.interface"
import { User } from "./user.model"
import { updatableUserFields } from "./user.constant"

const createUser = async (payload: IUser) => {
	const existUser = await User.findOne({ email: payload.email }).lean()
	if (existUser) {
		// Same shape the old API returned for duplicates.
		return { message: "user already exist", insertedId: null }
	}
	const created = await User.create(payload)
	// Match the native-driver insertOne result the client checks against.
	return { acknowledged: true, insertedId: created._id }
}

const getAllUsers = async () => {
	return User.find().lean()
}

/**
 * The old API registered GET /users/:email and GET /users/:id with the same
 * pattern, so the :id route was unreachable. A single lookup now handles
 * both: a valid ObjectId searches by _id, anything else by email.
 */
const getSingleUser = async (identifier: string) => {
	const query = mongoose.isValidObjectId(identifier)
		? { _id: new mongoose.Types.ObjectId(identifier) }
		: { email: identifier }
	return User.findOne(query).lean()
}

const updateBiodata = async (id: string, payload: Partial<IUser>) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid user id!")
	}

	// Only whitelisted biodata fields can be written.
	const updateDoc: Record<string, unknown> = {}
	for (const field of updatableUserFields) {
		if (field in payload) {
			updateDoc[field] = payload[field as keyof IUser]
		}
	}

	return User.updateOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ $set: updateDoc },
		{ upsert: true }
	)
}

const updatePremium = async (id: string, premium: boolean) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid user id!")
	}
	return User.updateOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ $set: { premium } }
	)
}

const makeAdmin = async (id: string) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid user id!")
	}
	return User.updateOne(
		{ _id: new mongoose.Types.ObjectId(id) },
		{ $set: { role: "admin" } }
	)
}

const isAdmin = async (email: string) => {
	const user = await User.findOne({ email }).lean()
	return { admin: user?.role === "admin" }
}

export const userServices = {
	createUser,
	getAllUsers,
	getSingleUser,
	updateBiodata,
	updatePremium,
	makeAdmin,
	isAdmin,
}
