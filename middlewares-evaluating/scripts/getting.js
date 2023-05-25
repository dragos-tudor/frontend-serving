
export const evalScript =  async (document, fetch) => {
  const sourceElem = document.querySelector("source")
  const targetElem = document.querySelector("target")

  const request = { body: sourceElem.innerText, method: "POST" }
  const response = await fetch("/eval", request)
  const ssrHtml = await response.text()

  targetElem.innerHTML = ssrHtml
}

export const getEvalScript = (source = "script[nomodule]", target = "main") =>
  evalScript.toString().split("=>")[1]
    .replace('"source"', `"${source}"`)
    .replace('"target"', `"${target}"`)