import express from 'express'
import 'express-async-errors'
import routes from '../routes'
import { errorHandler } from '../middlewares/errorHandling'

export const app = express()

app.use(express.json())
app.use(routes)

app.use(errorHandler)
