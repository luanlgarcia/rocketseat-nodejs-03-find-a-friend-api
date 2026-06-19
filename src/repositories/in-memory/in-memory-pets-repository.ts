import type { Pets, Prisma } from '@/generated/prisma/client'
import type { PetsRepository, SearchManyQuery } from '../pets-repository'
import { randomUUID } from 'node:crypto'
import type { OrgsId } from '../orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pets[] = []

  async findById (id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async searchMany (orgsId: OrgsId[], page: number, query?: SearchManyQuery) {
    const orgsIds = orgsId.map((org) => org.id)

    return this.items
      .filter((item) => orgsIds.includes(item.org_id))
      .filter((item) => !query?.age || item.age === query.age)
      .filter((item) => !query?.size || item.size === query.size)
      .filter((item) => !query?.energyLevel || item.energy_level === query.energyLevel)
      .filter((item) => !query?.independenceLevel || item.independence_level === query.independenceLevel)
      .filter((item) => !query?.environment || item.environment === query.environment)
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
