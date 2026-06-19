import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { env } from '@/env'

const schema = new URL(env.DATABASE_URL).searchParams.get('schema') ?? 'public'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  options: `-c search_path="${schema}"`,
})

const adapter = new PrismaPg(pool, { schema })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
