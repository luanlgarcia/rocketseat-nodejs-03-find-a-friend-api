import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { SearchcPetsUseCase } from '../search-pets'

export function makeSearchPetsUseCase () {
  const orgsRepository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository()
  const useCase = new SearchcPetsUseCase(orgsRepository, petsRepository)

  return useCase
}
