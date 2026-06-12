import type { FastifyInstance } from 'fastify'

export async function orgsRoutes (app: FastifyInstance) {
  app.get('/orgs', (request, reply) => {
    return reply.status(200).send()
  })
}
