import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Create Pets (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create pet', async () => {
    const { token } = await createAndAuthenticateOrg(app, true)

    const response = await request(app.server)
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
    expect(response.statusCode).toEqual(201)
  })
})
