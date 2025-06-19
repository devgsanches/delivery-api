import { Router } from 'express'
import DeliveriesController from '../controllers/deliveriesController'
import { ensureAuthenticated } from '@/middlewares/authenticate'
import { verifyUserAuthorization } from '@/middlewares/authorization'

const route = Router()
const deliveriesController = new DeliveriesController()

route.use(ensureAuthenticated)
route.get('/', deliveriesController.index)
route.post(
  '/',
  verifyUserAuthorization(['sale', 'customer']),
  deliveriesController.store
)
route.patch('/:id/status', deliveriesController.update)
route.delete('/:id', deliveriesController.delete)

export default route
