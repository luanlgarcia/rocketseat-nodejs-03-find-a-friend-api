import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetDetailsUseCase } from './get-pet-details'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', async () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetDetailsUseCase(petsRepository)

    await orgsRepository.create({
      id: 'org-1',
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: 99999999999,
    })
  })

  it('should be able to get pet details', async () => {
    const { id } = await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pet } = await sut.execute({
      petId: id
    })

    expect(pet.name).toEqual('Pet 1')
  })

  it('should not be able to get pet details with wrong id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-id'
      })
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
