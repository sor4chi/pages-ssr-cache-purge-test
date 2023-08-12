import { Hono } from 'hono'

type Bindings = {
  PRIVATE_SERVICE: Fetcher;
  WEBSITE_SERVICE: Fetcher;
  INTERNAL_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const res = await c.env.WEBSITE_SERVICE.fetch(c.req.raw)
  return res
})

app.get('/private/*', async (c) => {
  const res = await c.env.PRIVATE_SERVICE.fetch(c.req.raw, {
    headers: {
      'x-custom-token': c.env.INTERNAL_TOKEN
    }
  })
  return res
})

export default app
