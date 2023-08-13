import { Handler, Hono } from "hono";

type Bindings = {
  PRIVATE_SERVICE: Fetcher;
  WEBSITE_SERVICE: Fetcher;
  INTERNAL_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const maxAge = 5; // 1 minute

app.get("*", async (c) => {
  const url = new URL(c.req.url);
  const cacheKey = new Request(url.toString(), c.req.raw);
  const cache = caches.default;
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    const newResponse = new Response(cachedResponse.body, cachedResponse);
    newResponse.headers.delete("x-cache");
    newResponse.headers.append("x-cache", "HIT");
    return newResponse;
  }

  const response = await c.env.WEBSITE_SERVICE.fetch(c.req.raw);
  const newResponse = new Response(response.body, response);
  newResponse.headers.delete("cache-control");
  newResponse.headers.append("cache-control", `max-age=${maxAge}`);
  newResponse.headers.append("x-cache", "MISS");

  if (response.status === 200) {
    c.executionCtx.waitUntil(cache.put(cacheKey, newResponse.clone()));
  }
  return newResponse;
});

// app.get('/private/*', async (c) => {
//   const res = await c.env.PRIVATE_SERVICE.fetch(c.req.raw, {
//     headers: {
//       'x-custom-token': c.env.INTERNAL_TOKEN
//     }
//   })
//   return res
// })

export default app;
