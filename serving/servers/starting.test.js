import { assertEquals } from "/asserts.ts"
import { assertSpyCallArgs, spy } from "/mock.ts"
import { createOkResponse } from "../../serving-responses/mod.js"
import { startServer } from "./starting.js"

Deno.test("in order to use http server as a system I want to serve http requests", async (t) => {

  await t.step("request handler => server receive request => request handler response", async () => {
    const server = startServer(() => createOkResponse("ok"), {hostname: "localhost", port: 8080})
    const actual = await fetch(`http://localhost:8080/`)

    server.close()
    assertEquals(await actual.text(), "ok")
  })

  await t.step("multiple requests => server receive requests => parallel requests handling", async () => {
    const spyServer = spy(() => {})
    const handler = (request) => {
      const {pathname} = new URL(request.url)
      spyServer(`req-${pathname}`)

      const response = new Response(`resp-${pathname}`)
      return new Promise(resolve => setTimeout(() => resolve(response), 5))
    }
    const request = (pathname) => async () => {
      const resp = await fetch(`http://localhost:8080${pathname}`)
      spyServer(await resp.text())
    }

    const server = startServer(handler)
    await Promise.all([request("/x")(), request("/y")()])
    server.close()

    assertSpyCallArgs(spyServer, 0, ["req-/x"])
    assertSpyCallArgs(spyServer, 1, ["req-/y"])
    assertSpyCallArgs(spyServer, 2, ["resp-/x"])
    assertSpyCallArgs(spyServer, 3, ["resp-/y"])
  })

})
