import { Router } from 'express'
import usersRoutes from './usersRoutes'
import sessionRoutes from './sessionsRoutes'
import deliveriesRoutes from './deliveriesRoutes'
import deliveryLogRoutes from './deliveryLogsRoutes'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/sessions', sessionRoutes)
routes.use('/deliveries', deliveriesRoutes)
routes.use('/delivery-logs', deliveryLogRoutes)
export default routes
