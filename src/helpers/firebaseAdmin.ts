import admin from "firebase-admin"
import status from "http-status"
import config from "../config"
import ApiError from "../app/errors/ApiError"

/**
 * Lazily initialise the Firebase Admin SDK.
 *
 * Credentials come from FIREBASE_SERVICE_ACCOUNT, which accepts either:
 *  - a path to the service-account JSON file (recommended locally), or
 *  - the raw JSON itself (recommended on Vercel, where there is no file system)
 * GOOGLE_APPLICATION_CREDENTIALS is also honoured as a fallback.
 */
const getFirebaseAdmin = () => {
	if (!admin.apps.length) {
		const serviceAccount = config.firebaseServiceAccount

		if (serviceAccount) {
			const credential = serviceAccount.trim().startsWith("{")
				? admin.credential.cert(JSON.parse(serviceAccount))
				: admin.credential.cert(serviceAccount)
			admin.initializeApp({ credential })
		} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
			admin.initializeApp({
				credential: admin.credential.applicationDefault(),
			})
		} else {
			throw new ApiError(
				status.INTERNAL_SERVER_ERROR,
				"Firebase admin is not configured! Set FIREBASE_SERVICE_ACCOUNT in .env"
			)
		}
	}
	return admin
}

export default getFirebaseAdmin
