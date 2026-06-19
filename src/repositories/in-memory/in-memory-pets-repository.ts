import type { Pets, Prisma } from '@/generated/prisma/client'
import type { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'
import type { OrgsId } from '../orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pets[] = []

  async searchMany (orgsId: OrgsId[], page: number) {
    const orgsIds = orgsId.map((org) => org.id)

    return this.items
      .filter((item) => orgsIds.includes(item.org_id))
      .slice((page - 1) * 20, page * 20)
  }

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
