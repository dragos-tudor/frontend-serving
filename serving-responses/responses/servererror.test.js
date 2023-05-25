import { assertEquals } from "/asserts.ts"
import { createServerErrorResponse } from "./servererror.js"

Deno.test("server error reponse => get server error message => error message", async () => {
  assertEquals(await createServerErrorResponse().text(), "Internal server error")
  assertEquals(await createServerErrorResponse("abc").text(), "abc")
})