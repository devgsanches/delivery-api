import { Router } from 'express'
import { DeliveryLogsController } from '@/controllers/deliveryLogsController'
import { ensureAuthenticated } from '@/middlewares/authenticate'
import { verifyUserAuthorization } from '@/middlewares/authorization'

const route = Router()
const deliveryLogsController = new DeliveryLogsController()

route.use(ensureAuthenticated)
route.get('/', deliveryLogsController.index)
route.get('/:delivery_id', deliveryLogsController.show)
route.post('/', verifyUserAuthorization(['sale']), deliveryLogsController.store)
route.delete('/:id', deliveryLogsController.delete)

export default route
