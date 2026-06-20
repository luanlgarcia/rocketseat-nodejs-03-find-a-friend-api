import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search (request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    page: z.coerce.number().min(1).default(1),
    age: z.enum(['ADULT', 'PUPPY', 'SENIOR']).optional(),
    size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
    energyLevel: z.enum(['VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).optional(),
    independenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    environment: z.enum(['SMALL', 'MEDIUM', 'SPACIOUS']).optional(),
  })

  const {
    city,
    page,
    age,
    size,
    energyLevel,
    environment,
    independenceLevel
  } = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetsUseCase()

  const { pets } = await searchPetsUseCase.execute({
    city,
    page,
    age,
    energyLevel,
    environment,
    independenceLevel,
    size
  })

  return reply.status(200).send({
    pets
  })
}
