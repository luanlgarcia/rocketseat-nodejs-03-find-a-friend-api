import type { Age, EnergyLevel, Environment, IndependenceLevel, Pets, Prisma, Size } from '@/generated/prisma/client'
import type { OrgsId } from './orgs-repository'

export interface SearchManyQuery {
  age?: Age,
  size?: Size,
  energyLevel?: EnergyLevel,
  independenceLevel?: IndependenceLevel,
  environment?: Environment
}

export interface PetsRepository {
  findById(id: string): Promise<Pets | null>
  searchMany(orgsId: OrgsId[], page: number, query?: SearchManyQuery): Promise<Pets[]>
  create(data: Prisma.PetsUncheckedCreateInput): Promise<Pets>
}
