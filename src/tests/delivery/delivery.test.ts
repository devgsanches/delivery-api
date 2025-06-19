import { prisma } from '@/database/prisma'
import { app } from '@/express/app'
import type { User } from '@/interfaces/user'
import { AppError } from '@/utils/AppError'
import request from 'supertest'
import type { Response } from 'supertest'
import { hash } from 'bcrypt'
import { getAuthToken } from '@/tests/helpers/auth'

describe('deliveriesController', () => {
  let user: User
  let delivery: any
  let deliveryToDelete: any
  let response: Response
  const saltRounds = 10

  beforeAll(async () => {
    await prisma.user.create({
      data: {
        name: 'testNew-',
        email: 'testt@email.com',
        password: await hash('testtN', saltRounds),
        role: 'sale',
      },
    })

    const validateUser = await prisma.user.findFirst({
      where: {
        email: 'testt@email.com',
      },
    })

    if (!validateUser) {
      throw new AppError('User not found.')
    }

    user = validateUser
  })

  afterAll(async () => {
    await prisma.deliveryLog.deleteMany({
      where: {
        deliveryId: delivery.id,
      },
    })

    await prisma.delivery.deleteMany({
      where: {
        description: 'testDelivery',
      },
    })

    await prisma.user.delete({
      where: {
        email: 'testt@email.com',
      },
    })
  })

  it('should create a delivery', async () => {
    const { id, email } = user
    const token = await getAuthToken(email, 'testtN')

    response = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: id,
        description: 'testDelivery',
      })

    delivery = await prisma.delivery.findFirst({
      where: {
        description: 'testDelivery',
      },
    })

    expect(response.statusCode).toBe(201)
  })

  it('should return error when trying to create with non-existent user id', async () => {
    if (!user) {
      throw new AppError('User not found.')
    }

    const token = await getAuthToken(user.email, 'testtN')

    const response = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 'f495a643-8f29-4e1b-b8cb-ba3eb52e739f',
        description: 'MacBook M2',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message', 'User does not exist.')
  })

  it('should update the delivery status ', async () => {
    const delivery = await prisma.delivery.findFirst({
      where: {
        description: 'testDelivery',
      },
    })

    const token = await getAuthToken(user.email, 'testtN')

    const response = await request(app)
      .patch(`/deliveries/${delivery?.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'shipped',
      })

    expect(response.statusCode).toBe(200)
  })

  it('should remove a delivery', async () => {
    const userTest = await prisma.user.findFirst()

    if (!userTest) {
      throw new AppError('User not found.')
    }

    const { id } = userTest

    await prisma.delivery.create({
      data: {
        userId: id,
        description: 'this is a test. LoL',
      },
    })

    deliveryToDelete = await prisma.delivery.findFirst({
      where: {
        description: 'this is a test. LoL',
      },
    })

    if (!deliveryToDelete) {
      throw new AppError('Delivery not found.')
    }

    const token = await getAuthToken(user.email, 'testtN')

    const response = await request(app)
      .delete(`/deliveries/${deliveryToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })
})
