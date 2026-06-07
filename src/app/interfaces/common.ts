import { JwtPayload } from "jsonwebtoken"

export type IAuthUser = JwtPayload & {
	email: string
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: IAuthUser
		}
	}
}
