import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { generateCredentials } from './credentials.js'

type Env = {
  readonly TURN_SHARED_SECRET: string
  readonly TURN_SERVERS: string
  readonly TURN_STATIC_USER: string
  readonly TURN_STATIC_PASS: string
}

export const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors())

app.get('/api/turn-credentials', async c => {
  const secret =
    c.env?.TURN_SHARED_SECRET ??
    process.env.TURN_SHARED_SECRET ?? ''

  const servers = (
    c.env?.TURN_SERVERS ??
    process.env.TURN_SERVERS ??
    'turn.comprom.org'
  ).split(',')

  const staticUser =
    c.env?.TURN_STATIC_USER ??
    process.env.TURN_STATIC_USER
  const staticPass =
    c.env?.TURN_STATIC_PASS ??
    process.env.TURN_STATIC_PASS

  const creds = await generateCredentials(
    secret,
    servers,
    staticUser,
    staticPass
  )

  return c.json(creds)
})

app.get('/health', c =>
  c.json({ status: 'ok' })
)
