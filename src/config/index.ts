import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.join(process.cwd(), ".env") })

export default {
	env: process.env.NODE_ENV || "development",
	port: process.env.PORT || 5000,
	database: {
		// Prefer a full connection string; fall back to the legacy user/pass pair
		// so the existing Vercel env vars keep working.
		url:
			process.env.DATABASE_URL ||
			`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v07t2jx.mongodb.net/?retryWrites=true&w=majority`,
		dbName: process.env.DB_NAME || "matrimonyDB",
	},
	jwt: {
		// Legacy env var name (ACCESS_TOKEN) is still supported.
		accessSecret: process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN,
		expiresIn: process.env.JWT_EXPIRES_IN || "1h",
	},
	// Legacy env var name (STIPE_PAYMENT_KEY) is still supported.
	stripeSecretKey:
		process.env.STRIPE_SECRET_KEY || process.env.STIPE_PAYMENT_KEY,
	// Path to the service-account JSON file, or the raw JSON itself.
	firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
	// Comma-separated allowlist; unset = allow all origins (current behaviour).
	corsOrigins: process.env.CORS_ORIGINS,
}
