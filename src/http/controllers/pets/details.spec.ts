import { app } from '@/app'
import { creaeAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

describe('Pet Details (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to view the details of a specific pet.', async () => {
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

    const { id } = await prisma.pets.findFirstOrThrow()

    const response = await request(app.server).get(`/pets/${id}`).send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        name: 'Pet 1',
      })
    )
  })
})
