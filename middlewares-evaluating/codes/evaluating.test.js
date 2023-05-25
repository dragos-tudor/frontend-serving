import { assertStringIncludes } from "/asserts.ts"
import { evalCode } from "./evaluating.js"

Deno.test("run server code => use eval code", async (t) => {

  await t.step("js code => eval code => js ouput", async () => {
    const code = `
      import { assertEquals } from '/asserts.ts'
      console.log(typeof assertEquals)
    `
    const request = new Request("http://localhost/eval", { body: code, method: "post" })
    const result = await evalCode(request)

    assertStringIncludes(await result.text(), "function")
  })

  await t.step("js code with errors => eval code => js error", async () => {
    const code = `import * as abc from '/abc.js'`
    const request = new Request("http://localhost/eval", { body: code, method: "post" })
    const result = await evalCode(request)

    assertStringIncludes(await result.text(), 'Module not found "file:///abc.js"')
  })

})