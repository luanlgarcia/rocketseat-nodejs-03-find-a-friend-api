import type { Pets, Prisma } from '@/generated/prisma/client'
import type { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pets[] = []

  async create (data: Prisma.PetsUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      creted_at: new Date(),
      name: data.name,
      description: data.description ?? null,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      environment: data.environment,
      org_id: data.org_id
    }

    this.items.push(pet)

    return pet
  }
}
