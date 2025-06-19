import { AppError } from '@/utils/AppError'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { authConfig } from '@/configs/auth'

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token não informado', 401)
  }

  const token = authHeader.split(' ')[1]

  const { sub: user_id, role } = verify(token, authConfig.jwt.secret)

  req.user = {
    id: String(user_id),
    role,
  }

  return next()
}
