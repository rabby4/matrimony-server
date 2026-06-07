import express, { Application, Request, Response } from "express"
import cors from "cors"
import status from "http-status"
import config from "./config"
import router from "./app/router"
import globalErrorHandler from "./app/middlewares/globalErrorHandler"

const app: Application = express()

// If CORS_ORIGINS is set, only those origins are allowed; otherwise allow all
// (matches the original behaviour so the deployed client keeps working).
const allowedOrigins = config.corsOrigins
	?.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean)

app.use(
	cors(
		allowedOrigins?.length
			? { origin: allowedOrigins, credentials: true }
			: {}
	)
)

// parser
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
	res.send("Matrimony server is running!")
})

app.use("/", router)

app.use((req: Request, res: Response) => {
	res.status(status.NOT_FOUND).json({
		success: false,
		message: "API not found!",
		error: {
			path: req.originalUrl,
			message: "Your requested API path was not found!",
		},
	})
})

app.use(globalErrorHandler)

export default app
