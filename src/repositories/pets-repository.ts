import type { Pets, Prisma } from '@/generated/prisma/client'
import type { OrgsId } from './orgs-repository'

export interface PetsRepository {
  searchMany(orgsId: OrgsId[], page: number): Promise<Pets[]>
  create(data: Prisma.PetsUncheckedCreateInput): Promise<Pets>
}
