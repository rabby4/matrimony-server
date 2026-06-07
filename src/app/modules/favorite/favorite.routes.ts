import express from "express"
import { favoriteController } from "./favorite.controller"

const router = express.Router()

// TODO: all three need auth() + ownership checks once the client calls them
// via axiosSecure (currently it uses the public axios instance).

// POST /favorites — add a biodata to the requester's favorites
router.post("/", favoriteController.addFavorite)

// GET /favorites/:email — list a user's favorites
router.get("/:email", favoriteController.getFavoritesByEmail)

// DELETE /favorites/:id — remove a favorite
router.delete("/:id", favoriteController.removeFavorite)

export const favoriteRoutes = router
