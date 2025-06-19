import { Router } from 'express'
import SessionsController from '@/controllers/sessionsController'

const route = Router()
const sessionsController = new SessionsController()

route.post('/', sessionsController.store)

export default route
