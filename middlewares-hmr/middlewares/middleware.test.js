import { assertEquals, assertStringIncludes } from "/asserts.ts"
import { dirname } from "../../deps.js"
import { createNotFoundResponse, createOkResponse } from "../../serving-responses/mod.js"
import { hmrMiddleware } from "./middleware.js"
import { startHmrServer } from "../../mod.js"

const pwd = dirname(import.meta.url.replace("file://", ""))

Deno.test("reload modified files => use hmr middleware", async (t) => {
  await Deno.writeTextFile(`${pwd}/file.js`, "")

  await t.step("watch directory request => change directory files => hmr middleware respond with 'reload' message", async () => {
    const server = startHmrServer({hostname: "localhost", port: 8090, context: {cwd: pwd}})
    const socket = new WebSocket("ws://localhost:8090/watch")
    const rewriteFile = (filePath) => Deno.writeTextFileSync(filePath, Deno.readTextFileSync(filePath))

    let resolve = null
    const promise = new Promise(res => resolve = res)
    socket.onopen = () => rewriteFile(`${pwd}/file.js`)
    socket.onmessage = (msg) => {
      socket.close()
      assertEquals(JSON.parse(msg.data).name, "reload")
      assertEquals(JSON.parse(msg.data).payload, `/file.js`)
    }
    socket.onclose = () => resolve()

    await promise
    server.close()
  })

  await Deno.remove(`${pwd}/file.js`)

  await t.step("non-watch directory request => hmr middleware receive request => server send request to next middleware", async () => {
    const request = new Request("http://localhost/something")
    const actual = await hmrMiddleware(createNotFoundResponse)(request)

    assertEquals(actual.status, 404)
  })

  await Deno.writeTextFile(`${pwd}/index.html`, "<html><body></body></html>")

  await t.step("index file request => hmr middleware receive request => reload script injected into index file", async () => {
    const request = new Request("http://localhost")
    const next = () => createOkResponse("<body>index file</body>")
    const response = await hmrMiddleware(next)(request, {cwd: pwd})
    const actual = await response.text()

    assertEquals(response.status, 200)
    assertStringIncludes(actual, "<!-- injected by hmr middlware -->")
    assertStringIncludes(actual, "index file</body>")
  })

  await Deno.remove(`${pwd}/index.html`)
})