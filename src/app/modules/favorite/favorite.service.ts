import mongoose from "mongoose"
import status from "http-status"
import ApiError from "../../errors/ApiError"
import { Favorite } from "./favorite.model"

const addFavorite = async (payload: Record<string, unknown>) => {
	// The client posts a copy of a biodata document — drop its _id so the
	// favorite gets its own.
	delete payload._id
	const created = await Favorite.create(payload)
	return { acknowledged: true, insertedId: created._id }
}

const getFavoritesByEmail = async (email: string) => {
	return Favorite.find({ userEmail: email }).lean()
}

const removeFavorite = async (id: string) => {
	if (!mongoose.isValidObjectId(id)) {
		throw new ApiError(status.BAD_REQUEST, "Invalid favorite id!")
	}
	return Favorite.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
}

export const favoriteServices = {
	addFavorite,
	getFavoritesByEmail,
	removeFavorite,
}
