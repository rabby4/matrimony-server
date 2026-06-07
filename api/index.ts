// Vercel serverless entry point — all requests are rewritten here
// (see vercel.json). Local development uses src/server.ts instead.
import app from "../src/app"
import connectDB from "../src/shared/db"

// Kick off the connection on cold start; mongoose buffers queries until
// the connection is ready, and connectDB caches/reuses it across invocations.
connectDB().catch((error) =>
	console.error("Failed to connect to MongoDB:", error)
)

export default app
