import type { Prisma } from '@/generated/prisma/client'
import type { PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async create (data: Prisma.PetsUncheckedCreateInput) {
    const pet = await prisma.pets.create({
      data
    })

    return pet
  }
}
