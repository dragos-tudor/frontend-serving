import { assertEquals } from "/asserts.ts"
import { dirname } from "../../deps.js"
import { createResponse } from "../../serving-responses/mod.js"
import { cacheMiddleware } from "./middleware.js"

const pwd = dirname(import.meta.url.replace("file://", ""))

Deno.test("reload modified files => use cache middleware", async (t) => {
  await Deno.writeTextFile(`${pwd}/file.js`, "export const func = (arg) => arg")

  await t.step("cache file request => cache middleware receive request => respond '304'", async () => {
    const firstRequest = new Request("http://localhost/file.js", { method: "get" })
    const firstResponse = await cacheMiddleware(createResponse)(firstRequest, {cwd: pwd})

    assertEquals(firstResponse.status, 200)

    const headers = new Headers({"If-None-Match": firstResponse.headers.get("ETag")})
    const cacheRequest = new Request("http://localhost/file.js", { method: "get", headers })
    const cacheResponse = await cacheMiddleware(createResponse)(cacheRequest, {cwd: pwd})

    assertEquals(cacheResponse.status, 304)
  })

  await t.step("non-cache file request => cache middleware receive request => send request to next middleware", async () => {
    const request = new Request("http://localhost/file.js", { method: "get" })
    const actual = await cacheMiddleware(createResponse)(request, {cwd: pwd})

    assertEquals(actual.status, 200)
  })

  await t.step("non-get request => cache middleware receive request => send request to next middleware", async () => {
    const request = new Request("http://localhost/file.js", { method: "post" })
    const actual = await cacheMiddleware(createResponse)(request, {})

    assertEquals(actual.status, 200)
  })

  await t.step("non-file request => cache middleware receive request => send request to next middleware", async () => {
    const request = new Request("http://localhost/something", { method: "get" })
    const actual = await cacheMiddleware(createResponse)(request, {})

    assertEquals(actual.status, 200)
  })

  await Deno.remove(`${pwd}/file.js`)

  await Deno.writeTextFile(`${pwd}/index.html`, "")

  await t.step("cache index html => cache middleware receive request => respond '304'", async () => {
    const firstRequest = new Request("http://localhost/", { method: "get" })
    const firstResponse = await cacheMiddleware(createResponse)(firstRequest, {cwd: pwd})

    assertEquals(firstResponse.status, 200)

    const headers = new Headers({"If-None-Match": firstResponse.headers.get("ETag")})
    const cacheRequest = new Request("http://localhost/", { method: "get", headers })
    const cacheResponse = await cacheMiddleware(createResponse)(cacheRequest, {cwd: pwd})

    assertEquals(cacheResponse.status, 304)
  })

  await Deno.remove(`${pwd}/index.html`)

})
