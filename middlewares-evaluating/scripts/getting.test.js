import { assertStringIncludes } from "/asserts.ts"
import { evalMiddleware } from "../middlewares/middleware.js"
import { getEvalScript, evalScript } from "./getting.js"

Deno.test("run server code => use eval script", async (t) => {

  await t.step("source and target => get eval script => script with source and target", () => {
    const actual = getEvalScript("src", "tgt")
    assertStringIncludes(actual, 'querySelector("src")')
    assertStringIncludes(actual, 'querySelector("tgt")')
  })

  await t.step("html source and target => eval source script => target html with eval script html result", async () => {
    const source = { innerText: 'console.log("<div>abc</div>")' }
    const target = { innerHTML: "" }
    const document = { querySelector: (selector) => selector === "source"? source: target }

    const fetch = (url, request) => evalMiddleware()(new Request(`http://localhost${url}`, request))
    await evalScript(document, fetch)

    assertStringIncludes(target.innerHTML, "<div>abc</div>")
  })

})