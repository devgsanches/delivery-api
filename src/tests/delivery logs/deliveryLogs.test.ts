import { app } from '@/express/app'
import request from 'supertest'
import { getAuthToken } from '../helpers/auth'
import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { hash } from 'bcrypt'
import type { User } from '@/interfaces/user'

describe('deliveryLogsController', () => {
  let user: User

  beforeAll(async () => {
    const salt = 10

    await prisma.user.create({
      data: {
        name: 'testtNewToDeliveryLog',
        email: 'testtNewToDeliveryLog@email.com',
        password: await hash('testepass', salt),
        role: 'sale',
      },
    })

    const validateUser = await prisma.user.findFirst({
      where: {
        email: 'testtNewToDeliveryLog@email.com',
      },
    })

    if (!validateUser) {
      throw new AppError('User not created.')
    }

    user = validateUser
  })

  afterAll(async () => {
    const { id } = user
    const token = await getAuthToken(user.email, 'testepass')

    const deliveryLog = await prisma.deliveryLog.findFirst({
      where: {
        description: 'isso é um teste. LoL',
      },
    })

    if (!deliveryLog) {
      throw new AppError('Delivery log is not found.')
    }

    const response = await request(app)
      .delete(`/delivery-logs/${deliveryLog.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)

    await prisma.user.delete({
      where: {
        id,
      },
    })
  })

  it('should create a delivery log', async () => {
    const delivery = await prisma.delivery.findFirst({
      where: {
        description: 'MacBook M1',
      },
    })

    if (!user) {
      throw new AppError('User not searched')
    }

    if (!delivery) {
      throw new AppError('Delivery not searched')
    }

    const token = await getAuthToken(user.email, 'testepass')

    const response = await request(app)
      .post('/delivery-logs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        deliveryId: delivery.id,
        description: 'isso é um teste. LoL',
      })

    expect(response.statusCode).toBe(201)
  })

  it('should return the delivery logs list', async () => {
    const token = await getAuthToken(user.email, 'testepass')
    const response = await request(app)
      .get('/delivery-logs')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should return all records of a delivery', async () => {
    const token = await getAuthToken(user.email, 'testepass')

    const delivery = await prisma.delivery.findFirst({
      where: {
        status: 'delivered',
      },
    })

    if (!delivery) {
      throw new AppError('Delivery not found.')
    }

    const response = await request(app)
      .get(`/delivery-logs/${delivery?.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
  })
})
