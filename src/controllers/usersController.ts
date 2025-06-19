import { Request, Response } from 'express'
import { prisma } from '@/database/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { AppError } from '@/utils/AppError'

export default class UsersController {
  async store(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().trim().min(4),
      email: z.string().trim().email(),
      password: z.string().min(6),
    })
    const { name, email, password } = schema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user) {
      throw new AppError('There is already a user with this email')
    }

    const saltRounds = 10
    const hashedPassword = await hash(password, saltRounds)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json()
  }

  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany()

    res.json(users)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    if (!id) {
      throw new AppError('User ID must be provided')
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      throw new AppError(`User with id ${id} does not exist`)
    }

    await prisma.user.delete({
      where: {
        id,
      },
    })

    res.json()
  }
}
