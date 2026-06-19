import { app } from '@/app'
import request from 'supertest'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create org', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'John Doe',
      email: 'jhondoe2@example.com',
      password: '123456',
      city: 'Example City',
      address: 'Rua Example',
      whatsApp: 999999999
    })

    expect(response.statusCode).toEqual(201)
  })
})
