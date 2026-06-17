import type { Age, EnergyLevel, Environment, IndependenceLevel, Pets, Size } from '@/generated/prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

interface CreatePetsUseCaseRequest {
  name: string
  description: string | null
  age: Age
  size: Size
  energyLevel: EnergyLevel
  independenceLevel: IndependenceLevel
  environment: Environment
  orgId: string

}

interface CreatePetsUseCaseResponse {
  pet: Pets
}

export class CreatePetsUseCase {
  constructor (
    private orgsRespository: OrgsRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute ({
    orgId,
    name,
    description,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment
  }: CreatePetsUseCaseRequest): Promise<CreatePetsUseCaseResponse> {
    const org = await this.orgsRespository.findById(orgId)

    if (!org) {
      throw new ResouceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      description,
      age,
      size,
      energy_level: energyLevel,
      independence_level: independenceLevel,
      environment,
      org_id: orgId
    })

    return {
      pet
    }
  }
}
