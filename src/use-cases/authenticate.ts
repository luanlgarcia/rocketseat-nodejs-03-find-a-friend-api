import type { Org } from '@/generated/prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-erros'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor (private orgsRepository: OrgsRepository) {}

  async execute ({
    email,
    password
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, org.password_hash)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
