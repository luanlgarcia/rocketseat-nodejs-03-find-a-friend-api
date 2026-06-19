import type { Org, Prisma } from '@/generated/prisma/client'

export interface OrgsId {
  id: string
}

export interface OrgsRepository {
  findById(id: string): Promise<Org | null>
  findByEmail(email: string): Promise<Org | null>
  findManyCity(city: string): Promise<OrgsId[]>
  create(date: Prisma.OrgCreateInput): Promise<Org>
}
