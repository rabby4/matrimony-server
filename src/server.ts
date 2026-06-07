import { Server } from "http"
import app from "./app"
import config from "./config"
import connectDB from "./shared/db"

const main = async () => {
	try {
		await connectDB()
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error)
		process.exit(1)
	}

	const server: Server = app.listen(config.port, () => {
		console.log(`Matrimony app listening on port ${config.port}`)
	})

	const exitHandler = () => {
		if (server) {
			server.close(() => {
				console.log("Server closed due to an unexpected error")
			})
		}
		process.exit(1)
	}

	process.on("uncaughtException", (error) => {
		console.error(error)
		exitHandler()
	})
	process.on("unhandledRejection", (error) => {
		console.error(error)
		exitHandler()
	})
}

main()
