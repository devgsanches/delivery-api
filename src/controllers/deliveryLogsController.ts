import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class DeliveryLogsController {
  async store(req: Request, res: Response) {
    const schema = z.object({
      deliveryId: z.string().trim().uuid(),
      description: z.string().trim().min(4),
    })

    const { deliveryId, description } = schema.parse(req.body)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    if (!delivery) {
      throw new AppError('Delivery does not exist.')
    }

    if (delivery.status === 'delivered') {
      throw new AppError(
        'This order has already been delivered and it is not possible to assign records.'
      )
    }

    if (delivery.status === 'processing') {
      throw new AppError('Change status to shipped')
    }

    await prisma.deliveryLog.create({
      data: {
        description,
        deliveryId,
      },
    })

    res.status(201).json()
  }

  async index(req: Request, res: Response) {
    const logs = await prisma.deliveryLog.findMany({
      include: {
        delivery: {
          select: {
            description: true,
            status: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    res.json(logs)
  }

  async show(req: Request, res: Response) {
    const schemaParams = z.object({
      delivery_id: z.string().uuid(),
    })

    const { delivery_id } = schemaParams.parse(req.params)

    const delivery = await prisma.delivery.findUnique({
      where: {
        id: delivery_id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        logs: {
          select: {
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })

    if (!delivery) {
      throw new AppError('This delivery does not exist.', 404)
    }

    // regra de negócio
    if (req.user?.role === 'customer' && req.user?.id !== delivery?.userId) {
      throw new AppError('the user can only view their deliveries', 401)
    }

    res.json(delivery)
  }

  async delete(req: Request, res: Response) {
    const schemaParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = schemaParams.parse(req.params)

    const delivery = await prisma.deliveryLog.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      throw new AppError('Delivery does not exist.')
    }

    await prisma.deliveryLog.delete({
      where: {
        id,
      },
    })

    res.json()
  }
}
