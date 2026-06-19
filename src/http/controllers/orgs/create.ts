import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error'
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create (request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    city: z.string(),
    address: z.string(),
    // To do: Arrumar depois para receber string

    // whatsApp: z.string().regex(/^\d{11}$/, 'WhatsApp deve conter 11 dígitos'),
    whatsApp: z.number(),
  })

  const {
    name,
    email,
    password,
    city,
    address,
    whatsApp
  } = createBodySchema.parse(request.body)

  try {
    const createUseCase = makeCreateOrgUseCase()

    await createUseCase.execute({
      name,
      email,
      password,
      city,
      address,
      whatsApp
    })
  } catch (err) {
    if (err instanceof EmailAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
