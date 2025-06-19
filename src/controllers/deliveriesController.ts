import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'

export default class DeliveriesController {
  async index(req: Request, res: Response, next: NextFunction) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    res.json(deliveries)
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
      userId: z.string().trim().uuid(),
      description: z.string(),
    })
    const { userId, description } = schema.parse(req.body)

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new AppError('User does not exist.')
    }

    await prisma.delivery.create({
      data: {
        userId,
        description,
      },
    })

    res.status(201).json()
  }

  async update(req: Request, res: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(req.params)

    const schema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered']),
    })

    const { status } = schema.parse(req.body)

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    })

    if (!delivery) {
      throw new AppError('Delivery not found')
    }

    await prisma.delivery.update({
      data: {
        status,
      },
      where: {
        id,
      },
    })

    const translatedStatus = {
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
    }

    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery.id,
        description: `Pedido ${translatedStatus[status]}.`,
      },
    })

    res.json()
  }

  async delete(req: Request, res: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(req.params)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      throw new AppError('Delivery does not exist.')
    }

    await prisma.delivery.delete({
      where: {
        id,
      },
    })

    res.json()
  }
}
