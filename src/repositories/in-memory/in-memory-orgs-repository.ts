import type { Org, Prisma } from '@/generated/prisma/client'
import type { OrgsRepository } from '../orgs-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById (id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail (email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async create (data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? 'MEMBER',
      created_at: new Date(),
      city: data.city,
      address: data.address,
      whats_app: data.whats_app
    }

    this.items.push(org)

    return org
  }
}
