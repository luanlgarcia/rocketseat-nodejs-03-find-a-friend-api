import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from './authenticate'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-erros'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticae Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      name: 'John Doe Pets',
      email: 'johndoe@example.com',
      address: 'Rua Example',
      city: 'Example City',
      password_hash: await hash('123456', 6),
      whats_app: 99999999999,
    })

    const { org } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
