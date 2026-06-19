import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { SearchcPetsUseCase } from './search-pets'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchcPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new SearchcPetsUseCase(orgsRepository, petsRepository)

    await orgsRepository.create({
      id: 'org-1',
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: 99999999999,
    })

    await orgsRepository.create({
      id: 'org-2',
      name: 'John Doe Pets 2',
      email: 'johndoe2@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: 99999999999,
    })

    await orgsRepository.create({
      id: 'org-3',
      name: 'John Doe Pets 3',
      email: 'johndoe3@example.com',
      address: 'Rua Example',
      city: 'Teste City',
      password_hash: await hash('123456', 6),
      whats_app: 99999999999,
    })
  })

  it('Shoud be able to search for pets', async () => {
    await petsRepository.create({
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
    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      page: 1
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-1' }),
      expect.objectContaining({ id: 'pet-2' })
    ])
  })

  it('It should be possible to search for pets only from the specified city.', async () => {
    await petsRepository.create({
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

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-3',
      org_id: 'org-3',
      name: 'Pet 1',
      description: 'Pet description example 3',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Teste',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-3' }),
    ])
  })

  it('It should be possible to search for pets using an age filter.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      age: 'PUPPY',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-1' }),
    ])
  })

  it('It should be possible to search for pets using an energy level filter.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      energyLevel: 'LOW',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-2' }),
    ])
  })

  it('It should be possible to search for pets using an environment filter.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'LOW',
      environment: 'SMALL',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      environment: 'SMALL',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-2' }),
    ])
  })

  it('It should be possible to search for pets using an indepencence level filter.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'LOW',
      environment: 'SMALL',
      independence_level: 'MEDIUM',
      size: 'LARGE'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      independenceLevel: 'MEDIUM',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-2' }),
    ])
  })

  it('It should be possible to search for pets using an size filter.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 1',
      description: 'Pet description example 2',
      age: 'ADULT',
      energy_level: 'LOW',
      environment: 'SMALL',
      independence_level: 'MEDIUM',
      size: 'MEDIUM'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      size: 'MEDIUM',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-2' }),
    ])
  })

  it('It should be possible to search for pets using all filters.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 2',
      description: 'Pet description example 2',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'MEDIUM'
    })

    await petsRepository.create({
      id: 'pet-3',
      org_id: 'org-2',
      name: 'Pet 3',
      description: 'Pet description example 3',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'MEDIUM'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      age: 'PUPPY',
      energyLevel: 'HIGH',
      independenceLevel: 'HIGH',
      size: 'MEDIUM',
      page: 1
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([
      expect.objectContaining({ id: 'pet-2' }),
    ])
  })

  it('It should be possible to search for pets using all filters.', async () => {
    await petsRepository.create({
      id: 'pet-1',
      org_id: 'org-1',
      name: 'Pet 1',
      description: 'Pet description example',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'LARGE'
    })

    await petsRepository.create({
      id: 'pet-2',
      org_id: 'org-2',
      name: 'Pet 2',
      description: 'Pet description example 2',
      age: 'PUPPY',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'MEDIUM'
    })

    await petsRepository.create({
      id: 'pet-3',
      org_id: 'org-2',
      name: 'Pet 3',
      description: 'Pet description example 3',
      age: 'ADULT',
      energy_level: 'HIGH',
      environment: 'MEDIUM',
      independence_level: 'HIGH',
      size: 'MEDIUM'
    })

    const { pets } = await sut.execute({
      city: 'Example',
      age: 'PUPPY',
      energyLevel: 'HIGH',
      independenceLevel: 'HIGH',
      size: 'SMALL',
      page: 1
    })

    expect(pets).toHaveLength(0)
  })
})
