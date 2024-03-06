import { assertEquals } from "/asserts.ts"
import { assertSpyCallArgs, spy } from "/mock.ts"
import { createOkResponse } from "../../serving-responses/mod.js"
import { startServer } from "./starting.js"

Deno.test("use http server => serve http requests", async (t) => {

  await t.step("request handler => server receive request => request handler response", async () => {
    const server = startServer(() => createOkResponse("ok"), {hostname: "localhost", port: 8080})
    const actual = await fetch(`http://localhost:8080/`)

    server.close()
    assertEquals(await actual.text(), "ok")
  })

  await t.step("multiple requests => server receive requests => multiple requests handling", async () => {
    const spyServer = spy(() => {})
    const handler = (request) => {
      const {pathname} = new URL(request.url)
      spyServer(`request${pathname}`)

      const response = new Response(`response${pathname}`)
      return new Promise(resolve => setTimeout(() => resolve(response), 5))
    }
    const request = async (pathname) => {
      const response = await fetch(`http://localhost:8081${pathname}`)
      const responseContent = await response.text()
      spyServer(responseContent)
    }

    const server = startServer(handler, {hostname: "localhost", port: 8081})
    await Promise.all([request("/x"), request("/y")])
    server.close()

    assertSpyCallArgs(spyServer, 0, ["request/x"])
    assertSpyCallArgs(spyServer, 1, ["request/y"])
    assertSpyCallArgs(spyServer, 2, ["response/x"])
    assertSpyCallArgs(spyServer, 3, ["response/y"])
  })

})
