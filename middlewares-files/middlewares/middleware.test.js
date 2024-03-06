import { assertEquals, assertStringIncludes } from "/asserts.ts"
import { dirname } from "../../deps.js"
import { createNoContentResponse } from "../../serving-responses/mod.js"
import { createCompiler } from "../compilers/creating.js"
import { transpileTsFile, tsExtensions } from "../transpilers/transpiling.js"
import { filesMiddleware } from "./middleware.js"

const pwd = dirname(import.meta.url.replace("file://", ""))
const tsCompiler = createCompiler(transpileTsFile, tsExtensions)

Deno.test("run files server => use files middleware", async (t) => {
  await Deno.writeTextFile(`${pwd}/file.ts`, "export const func = (arg: string) => arg")

  await t.step("ts file => files middleware receive file request => compiled js file", async () => {
    const request = new Request("http://localhost/file.ts", {method: "get"})
    const actual = await filesMiddleware([tsCompiler])()(request, {cwd: pwd})

    assertStringIncludes(await actual.text(), 'func = (arg)')
  })

  await Deno.remove(`${pwd}/file.ts`)

  await Deno.writeTextFile(`${pwd}/file.jsx`, "export const A = () => <b></b>")

  await t.step("jsx file => files middleware receive file request => compiled js file", async () => {
    const request = new Request("http://localhost/file.jsx", {method: "get"})
    const actual = await filesMiddleware([tsCompiler])()(request, {cwd: pwd})

    assertStringIncludes(await actual.text(), 'React.createElement("b", null)')
  })

  await Deno.remove(`${pwd}/file.jsx`)
  // await Deno.writeTextFile(`${pwd}/file.scss`, "div { span { font-size: medium; } }")

  // await t.step("sass file => files middleware receive file request => compiled css file", async () => {
  //   const request = new Request("http://localhost/file.scss", {method: "get"})
  //   const actual = await filesMiddleware([sassCompiler])()(request, {cwd: pwd})

  //   assertStringIncludes(await actual.text(), 'div span {\n  font-size: medium;\n}')
  // })

  // await Deno.remove(`${pwd}/file.scss`)
  await Deno.writeTextFile(`${pwd}/file.js`, "const x = 1")

  await t.step("file request with query string => files middleware receive request => '200' file content", async () => {
    const request = new Request("http://localhost/file.js?param=abc", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(await actual.text(), "const x = 1")
  })

  await Deno.remove(`${pwd}/file.js`)
  await Deno.writeTextFile(`${pwd}/empty.js`, "")

  await t.step("empty file request => files middleware receive request => '204' No Content", async () => {
    const request = new Request("http://localhost/empty.js", {method: "get"})
    const actual = await filesMiddleware([])(createNoContentResponse)(request, {cwd: pwd})

    assertEquals(actual.status, 204)
  })

  await Deno.remove(`${pwd}/empty.js`)

  await t.step("non-file request => files middleware receive request => goto next middleware", async () => {
    const request = new Request("http://localhost/something", {method: "get"})
    const actual = await filesMiddleware([])(createNoContentResponse)(request, {cwd: pwd})

    assertEquals(actual.status, 204)
  })

  await t.step("non-existing file request => files middleware receive file request => '404' Not Found", async () => {
    const request = new Request("http://localhost/non-existing.txt", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.status, 404)
    assertStringIncludes(await actual.text(), "Not Found")
  })

  await t.step("non-existing jsx file request => files middleware receive file request => '404' Not Found", async () => {
    const request = new Request("http://localhost/non-existing.jsx", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.status, 404)
    assertStringIncludes(await actual.text(), "Not Found")
  })

  await Deno.writeTextFile(`${pwd}/index.html`, '<html><body></body></html>')

  await t.step("root request and existing 'index.html' => files middleware receive file request => 'index.html'", async () => {
    const request = new Request("http://localhost/", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.status, 200)
    assertStringIncludes(await actual.text(), "<html>")
  })

  await t.step("root path base request and existing 'index.html' => files middleware receive file request => 'index.html'", async () => {
    const request = {url: "/index.html", method: "get"}
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.status, 200)
    assertStringIncludes(await actual.text(), "<html>")
  })

  await t.step("root request with query string => files middleware receive file request => 'index.html'", async () => {
    const request = new Request("http://localhost/?test=1", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.status, 200)
    assertStringIncludes(await actual.text(), "<html>")
  })

  await Deno.remove(`${pwd}/index.html`)

  await t.step("root request and not existing 'index.html' => files middleware receive request => '404' Not Found", async () => {
    const request = new Request("http://localhost/index.htm", {method: "get"})
    const actual = await filesMiddleware([])()(request)

    assertEquals(actual.status, 404)
  })

  await Deno.writeFile(`${pwd}/file.dat`, new TextEncoder().encode("abc"))

  await t.step("binary file request => files middleware receive request => default media type", async () => {
    const request = new Request("http://localhost/file.dat", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.headers.get("content-type"), "application/octet-stream")
  })

  await Deno.remove(`${pwd}/file.dat`)

  await Deno.writeFile(`${pwd}/file.gz`, new Uint8Array([0x1F, 0x8B, 0x11]))

  await t.step("gz file request => files middleware receive request => gzip content type", async () => {
    const request = new Request("http://localhost/file.gz", {method: "get"})
    const actual = await filesMiddleware([])()(request, {cwd: pwd})

    assertEquals(actual.headers.get("content-encoding"), "gzip")
  })

  await Deno.remove(`${pwd}/file.gz`)

})
