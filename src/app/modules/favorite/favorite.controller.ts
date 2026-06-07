import catchAsync from "../../../shared/catchAsync"
import { favoriteServices } from "./favorite.service"

const addFavorite = catchAsync(async (req, res) => {
	const result = await favoriteServices.addFavorite(req.body)
	res.send(result)
})

const getFavoritesByEmail = catchAsync(async (req, res) => {
	const result = await favoriteServices.getFavoritesByEmail(
		req.params.email as string
	)
	res.send(result)
})

const removeFavorite = catchAsync(async (req, res) => {
	const result = await favoriteServices.removeFavorite(req.params.id as string)
	res.send(result)
})

export const favoriteController = {
	addFavorite,
	getFavoritesByEmail,
	removeFavorite,
}
