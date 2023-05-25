import { assertEquals } from "/asserts.ts"
import { createJsonResponse } from "../../serving-responses/mod.js"
import { errorsMiddleware } from "./middleware.js"

Deno.test("handle unhandled errors => use errors middleware", async (t) => {

  await t.step("non-async error throwing middleware => throw error => errors middleware handle error", async () => {
    const next = () => { throw new Error("abc") }
    const request = new Request("http://local")
    const actual = await errorsMiddleware(next)(request)

    assertEquals(await actual.text(), "abc")
  })

  await t.step("async error throwing middleware => throw error => errors middleware handle error", async () => {
    const next = () => Promise.reject(Error("abc"))
    const request = new Request("http://local")
    const actual = await errorsMiddleware(next)(request)

    assertEquals(await actual.text(), "abc")
  })

  await t.step("non-async throwing middleware => throw error => errors middleware respond 404 'Not Found'", async () => {
    const next = () => { throw new Deno.errors.NotFound("abc") }
    const request = new Request("http://local")
    const actual = await errorsMiddleware(next)(request)

    assertEquals(actual.status, 404)
  })

  await t.step("URI error throwing middleware => throw error => errors middleware respond 404 'Bad Request'", async () => {
    const next = () => { throw new URIError("abc") }
    const request = new Request("http://local")
    const actual = await errorsMiddleware(next)(request)

    assertEquals(actual.status, 400)
  })

  await t.step("not found error => throw error => errors middleware respond 404 'Not Found'", async () => {
    const next = () => { throw new Deno.errors.NotFound("abc") }
    const request = new Request("http://local")
    const actual = await errorsMiddleware(next)(request)

    assertEquals(actual.status, 404)
  })

  await t.step("non-error throwing middleware => errors midddleware receive response => do nothing", async () => {
    const request = new Request("http://local")
    const actual = await errorsMiddleware(() => createJsonResponse({a: 1}))(request)

    assertEquals(actual.status, 200)
    assertEquals(await actual.json(), {a: 1})
  })

})