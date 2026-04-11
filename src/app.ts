import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { generateCredentials } from './credentials.js'

export const app = new Hono()

app.use('/*', cors())

app.get('/api/turn-credentials', async c => {
  const creds = await generateCredentials()
  return c.json(creds)
})

app.get('/health', c =>
  c.json({ status: 'ok' })
)
