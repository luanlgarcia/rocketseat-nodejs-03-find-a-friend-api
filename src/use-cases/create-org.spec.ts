import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { CreateOrgUseCase } from './create-org'
import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { EmailAlreadyExistsError } from './errors/email-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('shold to create org', async () => {
    const { org } = await sut.execute({
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password: '123456',
      whatsApp: '99999999999',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon create', async () => {
    const { org } = await sut.execute({
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password: '123456',
      whatsApp: '99999999999',
    })

    const isPasswordCorrectlyHashd = await compare(
      '123456',
      org.password_hash
    )

    expect(isPasswordCorrectlyHashd).toBe(true)
  })

  it('should not be possible to create an organization with the same email address.', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe Pets',
      email,
      address: 'Rua Example',
      city: 'Example City',
      password: '123456',
      whatsApp: '99999999999',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe Pets 2',
        email,
        address: 'Rua Example',
        city: 'Example City',
        password: '123456',
        whatsApp: '99999999999',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
})
