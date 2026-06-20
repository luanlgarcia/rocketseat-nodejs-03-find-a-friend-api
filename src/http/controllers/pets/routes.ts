import type { FastifyInstance } from 'fastify'
import { create } from './create'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { details } from './details'

export async function petsRoutes (app: FastifyInstance) {
  app.get('/pets/search', search)
  app.get('/pets/:petId', details)

  app.post('/pets', { onRequest: [verifyJwt] }, create)
}
