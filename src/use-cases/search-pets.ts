import { Age, EnergyLevel, Environment, IndependenceLevel, Size, type Pets } from '@/generated/prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  city: string
  age?: Age
  size?: Size,
  energyLevel?: EnergyLevel,
  independenceLevel?: IndependenceLevel,
  environment?: Environment,
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pets[]
}

export class SearchPetsUseCase {
  constructor (
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute ({
    city,
    age,
    energyLevel,
    environment,
    independenceLevel,
    size,
    page
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const orgs = await this.orgsRepository.findManyCity(city)

    if (orgs.length === 0) {
      return {
        pets: []
      }
    }

    const query = {
      age,
      energyLevel,
      environment,
      independenceLevel,
      size
    }

    const pets = await this.petsRepository.searchMany(orgs, page, query)

    return {
      pets
    }
  }
}
