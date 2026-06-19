import type { Pets } from '@/generated/prisma/client'
import type { PetsRepository } from '@/repositories/pets-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

interface GetPetDetailsUseCaseRequest {
  petId: string
}

interface GetPetDetailsUseCaseResponse {
  pet: Pets
}

export class GetPetDetailsUseCase {
  constructor (private petsRepository: PetsRepository) {}

  async execute ({
    petId,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResouceNotFoundError()
    }

    return {
      pet
    }
  }
}
