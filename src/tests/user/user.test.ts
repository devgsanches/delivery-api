import request from 'supertest'
import { app } from '@/express/app'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import type { User } from '@/interfaces/user'

enum UserRole {
  customer = 'customer',
  sale = 'sale',
}

describe('usersController', () => {
  let user: User

  beforeAll(async () => {
    const validUser = await prisma.user.findFirst()

    if (!validUser) {
      throw new AppError('No users found.')
    }

    user = validUser
  })

  it('should create a user', async () => {
    const response = await request(app).post('/users').send({
      name: 'tester',
      email: 'test@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    await prisma.user.delete({
      where: {
        email: 'test@email.com',
      },
    })
  })

  it('should give error when creating user', async () => {
    const response = await request(app).post('/users').send({
      email: user.email,
      password: 'password123456',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message', 'Validation error!')
  })

  it('should list users', async () => {
    const response = await request(app).get('/users')

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should delete a user', async () => {
    await prisma.user.create({
      data: {
        name: 'testUser',
        email: 'testUser@email.com',
        password: '123456',
      },
    })

    const user = await prisma.user.findUnique({
      where: { email: 'testUser@email.com' },
    })

    const response = await request(app).delete(`/users/${user?.id}`)

    expect(response.statusCode).toBe(200)
  })
})
