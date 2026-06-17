import type { Org } from '@/generated/prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import { hash } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

interface CreateOrgUseCaseRequest {
  name: string
  email: string
  password: string
  city: string
  address: string
  whatsApp: number
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor (private OrgsRepository: OrgsRepository) {}

  async execute ({
    name,
    email,
    password,
    city,
    address,
    whatsApp,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const passwordHash = await hash(password, 6)

    const orgWithSameEmail = await this.OrgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const org = await this.OrgsRepository.create({
      name,
      email,
      password_hash: passwordHash,
      address,
      city,
      whats_app: whatsApp
    })

    return {
      org
    }
  }
}
