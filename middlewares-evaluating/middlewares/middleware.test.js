import { assertStringIncludes } from "/asserts.ts"
import { evalMiddleware } from "./middleware.js"


Deno.test("run server code => use eval middleware", async (t) => {

  await t.step("eval script request => eval middleware receive request => eval script", async () => {
    const request = new Request("http://localhost/eval?source=src&target=tgt")
    const response = await evalMiddleware()(request)
    const actual = await response.text()

    assertStringIncludes(actual, 'querySelector("src")')
    assertStringIncludes(actual, 'querySelector("tgt")')
  })

})