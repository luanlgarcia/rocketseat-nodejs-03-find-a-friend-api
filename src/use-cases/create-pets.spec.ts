import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { CreatePetsUseCase } from './create-pets'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'

let orgsRespository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: CreatePetsUseCase

describe('Create Pet Use Case', () => {
  beforeEach(async () => {
    orgsRespository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetsUseCase(orgsRespository, petsRepository)

    await orgsRespository.create({
      id: 'org-1',
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: '99999999999',
    })
  })

  it('should to create pets', async () => {
    const { pet } = await sut.execute({
      orgId: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'ADULT',
      energyLevel: 'HIGH',
      environment: 'MEDIUM',
      independenceLevel: 'HIGH',
      size: 'LARGE'
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
