import { prisma } from '@/database/prisma'
import { app } from '@/express/app'
import type { User } from '@/interfaces/user'
import { AppError } from '@/utils/AppError'
import request from 'supertest'
import { hash } from 'bcrypt'

describe('sessionsController', () => {
  let user: User

  beforeAll(async () => {
    const saltRounds = 10
    await prisma.user.create({
      data: {
        name: 'newTest',
        email: 'testNewUser@email.com',
        password: await hash('pass123456', saltRounds),
      },
    })

    const validUser = await prisma.user.findUnique({
      where: {
        email: 'testNewUser@email.com',
      },
    })

    if (!validUser) {
      throw new AppError('User not created.')
    }

    user = validUser
  })

  it('should log in', async () => {
    const { email } = user

    const response = await request(app).post('/sessions').send({
      email,
      password: 'pass123456',
    })

    const { password: pass, createdAt, updatedAt, ...restUser } = user

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('token')
    expect(response.body.user).toMatchObject({
      ...restUser,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt?.toISOString(),
    })

    await prisma.user.delete({
      where: {
        email,
      },
    })
  })

  it('should return error when trying to log in', async () => {
    const user = await prisma.user.findFirst()

    if (!user) {
      throw new AppError('User not found.')
    }

    const response = await request(app).post('/sessions').send({
      email: user?.email,
      password: user.password, // hashed pass
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty(
      'message',
      'E-mail e/ou senha incorretas.'
    )
  })
})
