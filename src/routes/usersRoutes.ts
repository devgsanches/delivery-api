import Router from 'express'
import UsersController from '../controllers/usersController'

const route = Router()
const usersController = new UsersController()

route.get('/', usersController.index)
route.post('/', usersController.store)
route.delete('/:id', usersController.delete)

export default route
