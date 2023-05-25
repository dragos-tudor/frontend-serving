import { assertEquals } from "/asserts.ts"
import { createJsonResponse } from "./withcodes.js"

Deno.test("body and status code => get http json response => json response", async () => {
  const response = createJsonResponse("abc", 200)
  assertEquals(response instanceof Response, true)
  assertEquals(response.status, 200)
  assertEquals(await response.text(), "abc")
})