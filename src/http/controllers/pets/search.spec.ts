import { app } from '@/app'
import { creaeAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Search Pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()

    const { token } = await creaeAndAuthenticateOrg(app, true)

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet 1',
        description: 'Pet description example',
        age: 'ADULT',
        energyLevel: 'HIGH',
        environment: 'MEDIUM',
        independenceLevel: 'HIGH',
        size: 'LARGE'
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet 2',
        description: 'Pet description example 2',
        age: 'ADULT',
        energyLevel: 'HIGH',
        environment: 'MEDIUM',
        independenceLevel: 'HIGH',
        size: 'MEDIUM'
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Pet 3',
        description: 'Pet description example 3',
        age: 'ADULT',
        energyLevel: 'HIGH',
        environment: 'MEDIUM',
        independenceLevel: 'HIGH',
        size: 'LARGE'
      })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search pets by city', async () => {
    const response = await request(app.server)
      .get('/pets/search')
      .query({
        city: 'Example'
      })
      .send()

    console.log(response.body.pets)

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(3)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Pet 3' }),
        expect.objectContaining({ name: 'Pet 2' }),
        expect.objectContaining({ name: 'Pet 1' })
      ])
    )
  })
  it('It should be possible to search for pets using optional filters.', async () => {
    const response = await request(app.server)
      .get('/pets/search')
      .query({
        city: 'Example',
        age: 'ADULT',
        energyLevel: 'HIGH',
        environment: 'MEDIUM',
        independenceLevel: 'HIGH',
        size: 'LARGE'
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(2)
    expect(response.body.pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Pet 3' }),
        expect.objectContaining({ name: 'Pet 1' })
      ])
    )
  })
})
