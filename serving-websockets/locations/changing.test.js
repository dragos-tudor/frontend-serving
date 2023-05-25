import { assertEquals, assertStringIncludes } from "/asserts.ts"
import { changeLocation } from "./changing.js"

Deno.test("reload html pages => change locations", async (t) => {
  const url = (url) => new URL(url)
  const msg = {name: "reload"}

  await t.step("non-reload message => change location => same location", () => {
    assertEquals(changeLocation(url("http://a.com/test"))({name: "x"}).href, "http://a.com/test")
  })

  await t.step("root location => change location => same location", () => {
    assertStringIncludes(changeLocation(url("http://a.com"))(msg).href, "http://a.com/")
    assertStringIncludes(changeLocation(url("http://a.com?"))(msg).href, "http://a.com/")
    assertStringIncludes(changeLocation(url("http://a.com/"))(msg).href, "http://a.com/")
    assertStringIncludes(changeLocation(url("http://a.com/?"))(msg).href, "http://a.com/")
  })

  await t.step("root location with query string => change location => same location", () => {
    assertStringIncludes(changeLocation(url("http://a.com?x=1"))(msg).href, "http://a.com/?x=1")
    assertStringIncludes(changeLocation(url("http://a.com/?x=1"))(msg).href, "http://a.com/?x=1")
  })

  await t.step("non-root location => change location => location with reload url query param", () => {
    assertStringIncludes(changeLocation(url("http://a.com/test"))(msg).href, "http://a.com/?reloadUrl=%2Ftest")
    assertStringIncludes(changeLocation(url("http://a.com/test/123"))(msg).href, "http://a.com/?reloadUrl=%2Ftest%2F123")
  })

  await t.step("non-root location => change location => location with reload file query param", () => {
    assertEquals(changeLocation(url("http://a.com/test"))({...msg, payload: "/file.js"}).href,
      `http://a.com/?reloadUrl=${encodeURIComponent("/test")}&reloadFile=${encodeURIComponent("/file.js")}`)
  })

  await t.step("non-root location with query string => change location => location with reload url query param and query string", () => {
    assertStringIncludes(changeLocation(url("http://a.com/test?x=1"))(msg).href, "http://a.com/?reloadUrl=%2Ftest&x=1")
    assertStringIncludes(changeLocation(url("http://a.com/test/123/?x=1"))(msg).href, "http://a.com/?reloadUrl=%2Ftest%2F123%2F&x=1")
  })

})