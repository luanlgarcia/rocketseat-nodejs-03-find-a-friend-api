import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { CreatePetsUseCase } from '../create-pets'

export function makeCreatePetsUseCase () {
  const orgsRespository = new PrismaOrgsRepository()
  const petsRepository = new PrismaPetsRepository()
  const useCase = new CreatePetsUseCase(orgsRespository, petsRepository)

  return useCase
}
