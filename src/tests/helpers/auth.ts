import { app } from '@/express/app'
import request from 'supertest'

export async function getAuthToken(email: string, password: string) {
  const response = await request(app).post('/sessions').send({
    email,
    password,
  })

  return response.body.token
}
