import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg (
  app: FastifyInstance,
  isAdmin = false
) {
  await prisma.org.create({
    data: {
      name: 'Jhon Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: '99999999999',
      role: isAdmin ? 'ADMIN' : 'MEMBER'
    }
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456'
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
