import type { Pets } from '@/generated/prisma/client'
import type { OrgsRepository } from '@/repositories/orgs-repository'
import type { PetsRepository } from '@/repositories/pets-repository'

interface SearchPetsUseCaseRequest {
  city: string
  page: number
}

interface SearchPetsUseCaseResponse {
  pets: Pets[]
}

export class SearchcPetsUseCase {
  constructor (
    private orgsRepository: OrgsRepository,
    private petsRepository: PetsRepository
  ) {}

  async execute ({
    city,
    page
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const orgs = await this.orgsRepository.findManyCity(city)

    if (orgs.length === 0) {
      return {
        pets: []
      }
    }

    const pets = await this.petsRepository.searchMany(orgs, page)

    return {
      pets
    }
  }
}
