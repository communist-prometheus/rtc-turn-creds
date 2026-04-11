import { serve } from '@hono/node-server'
import { app } from './app.js'

const port = Number(
  process.env.PORT ?? '8788'
)

serve({ fetch: app.fetch, port }, info => {
  console.log(
    `[rtc-turn-creds] listening on :${info.port}`
  )
})
