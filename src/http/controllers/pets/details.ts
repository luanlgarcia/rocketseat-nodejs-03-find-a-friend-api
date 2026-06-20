import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function details (request: FastifyRequest, reply: FastifyReply) {
  const getPetDetailsParamsSchema = z.object({
    petId: z.uuid()
  })

  const { petId } = getPetDetailsParamsSchema.parse(request.params)

  const getPetDetailsUseCase = makeGetPetDetailsUseCase()

  const pet = await getPetDetailsUseCase.execute({
    petId
  })

  return reply.status(200).send(pet)
}
