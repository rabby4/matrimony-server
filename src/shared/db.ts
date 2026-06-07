import mongoose from "mongoose"
import config from "../config"

let connectionPromise: Promise<typeof mongoose> | null = null

/**
 * Connect to MongoDB once and reuse the connection. Safe for serverless:
 * repeated calls share the same in-flight/established connection, and
 * mongoose buffers queries until the connection is ready.
 */
const connectDB = async () => {
	if (!connectionPromise) {
		connectionPromise = mongoose
			.connect(config.database.url, { dbName: config.database.dbName })
			.then((conn) => {
				console.log("MongoDB connected successfully!")
				return conn
			})
			.catch((error) => {
				// Reset so the next invocation can retry instead of caching a failure.
				connectionPromise = null
				throw error
			})
	}
	return connectionPromise
}

export default connectDB
