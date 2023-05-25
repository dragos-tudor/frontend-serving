import { assertThrows, assert } from "/asserts.ts"
import { guardParam } from "./guarding.js"

Deno.test("use public functions => guard params", async (t) => {

  await t.step("valid param types => guard params => no error", () => {
    guardParam("a", 1)
    guardParam("a", 1, "number")
    guardParam("a", "", "string")
    guardParam("a", [], Array)
    guardParam("a", new Error(), Error)
    guardParam("a", {}, "object")
    guardParam("a", () => {}, "function")
    assert(true)
  })

  await t.step("invalid param types => guard params => throw type errors", () => {
    const msg = "Param 'a' expect type 'string'"
    assertThrows(() => guardParam("a", 1, "string"), Error, msg)
    assertThrows(() => guardParam("a", {}, "string"), Error, msg)
  })

  await t.step("null|undefined params values => guard params => throw null errors", () => {
    const msg = "Param 'a' value is null or undefined."
    assertThrows(() => guardParam("a", null), Error, msg)
    assertThrows(() => guardParam("a", undefined), Error, msg)
  })

  await t.step("invalid instance types => guard params => throw instance type errors", () => {
    const msg = "Param 'a' value expect instance of 'Array'"
    assertThrows(() => guardParam("a", 1, Array), Error, msg)
    assertThrows(() => guardParam("a", new Error(), Array), Error, msg)
  })

})