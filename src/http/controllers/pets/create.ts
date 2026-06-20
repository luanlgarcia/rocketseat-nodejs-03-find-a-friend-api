import { makeCreatePetsUseCase } from '@/use-cases/factories/make-create-pets-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create (request: FastifyRequest, reply: FastifyReply) {
  const createPetsBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    age: z.enum(['ADULT', 'PUPPY', 'SENIOR']),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']),
    energyLevel: z.enum(['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']),
    independenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.enum(['SMALL', 'MEDIUM', 'SPACIOUS'])
  })

  const {
    name,
    description,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment
  } = createPetsBodySchema.parse(request.body)

  const createPetsUseCase = makeCreatePetsUseCase()

  await createPetsUseCase.execute({
    orgId: request.user.sub,
    name,
    description,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment
  })

  return reply.status(201).send()
}
