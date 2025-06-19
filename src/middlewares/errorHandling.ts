import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from 'express'
import { AppError } from '../utils/AppError'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  if (err instanceof ZodError) {
    res
      .status(400)
      .json({ message: 'Validation error!', issues: [err.format()] })
    return
  }

  res.status(500).json({ message: err.message || 'Erro interno do servidor' })
}
