import type { Pets, Prisma } from '@/generated/prisma/client'

export interface PetsRepository {
  create(data: Prisma.PetsUncheckedCreateInput): Promise<Pets>
}
