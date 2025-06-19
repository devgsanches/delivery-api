import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { authConfig } from '@/configs/auth'

class SessionsController {
  async store(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().trim().email(),
      password: z.string().trim().min(6),
    })

    const { email, password } = schema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new AppError('E-mail e/ou senha incorretas.')
    }

    const verify = await compare(password, user.password)

    if (!verify) {
      throw new AppError('E-mail e/ou senha incorretas.')
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign(
      {
        role: user.role,
      },
      secret,
      {
        expiresIn,
        subject: String(user.id),
      }
    )

    const { password: hashedPassword, ...userRest } = user

    res.status(201).json({ token, user: { ...userRest } })
  }
}

export default SessionsController
