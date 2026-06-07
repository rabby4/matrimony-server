import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"

const validateRequest = (schema: ZodType) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = await schema.parseAsync(req.body)
			next()
		} catch (error) {
			next(error)
		}
	}
}

export default validateRequest
