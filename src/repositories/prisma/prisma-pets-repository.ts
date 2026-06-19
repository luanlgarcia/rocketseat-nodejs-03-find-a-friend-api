import type { Prisma } from '@/generated/prisma/client'
import type { PetsRepository, SearchManyQuery } from '../pets-repository'
import { prisma } from '@/lib/prisma'
import type { OrgsId } from '../orgs-repository'

export class PrismaPetsRepository implements PetsRepository {
  async searchMany (orgsId: OrgsId[], page: number, query?: SearchManyQuery) {
    const pets = await prisma.pets.findMany({
      where: {
        org_id: {
          in: orgsId.map((org) => org.id)
        },
        age: query?.age,
        size: query?.size,
        energy_level: query?.energyLevel,
        environment: query?.environment,
        independence_level: query?.independenceLevel
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return pets
  }

  async create (data: Prisma.PetsUncheckedCreateInput) {
    const pet = await prisma.pets.create({
      data
    })

    return pet
  }
}
