import { assertEquals } from "/asserts.ts"
import { debounceExec } from "./debouncing.js"

Deno.test("in order to optimize watching modified files as a system I want to debounce files changes events", async (t) => {

  await t.step("given debounced function when debounce execution then function should run after specified delay", async () => {
    let debounce = null
    const promise = new Promise(resolve => debounce =
      debounceExec((arg) => resolve(arg), 50)
    )
    debounce(1)

    const actual = await promise
    assertEquals(actual, 1)
  })

  await t.step("given debounced function when debounce multiple times execution then function should run once after specified delay", async () => {
    let debounce = null
    let counter = 1
    const promise = new Promise(resolve => debounce =
      debounceExec(() => resolve(counter++), 50)
    )
    debounce()
    debounce()
    debounce()

    const actual = await promise
    assertEquals(actual, 1)
  })

})


