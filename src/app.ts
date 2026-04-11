import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { generateCredentials } from './credentials.js'

type Env = {
  readonly TURN_SHARED_SECRET: string
  readonly TURN_SERVERS: string
}

export const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors())

app.get('/api/turn-credentials', async c => {
  const secret =
    c.env?.TURN_SHARED_SECRET ??
    process.env.TURN_SHARED_SECRET ??
    'rtc-less-e2e-test-secret'

  const servers = (
    c.env?.TURN_SERVERS ??
    process.env.TURN_SERVERS ??
    'localhost'
  ).split(',')

  const creds = await generateCredentials(secret, servers)

  return c.json(creds)
})

app.get('/health', c => c.json({ status: 'ok' }))
