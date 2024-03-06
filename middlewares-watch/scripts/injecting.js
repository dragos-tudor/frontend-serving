import { ReloadScript } from "./ReloadScript.js"

export const injectReloadScript = async (response) => {
  const html = new TextDecoder().decode(await response.arrayBuffer())
  const reloadHtml = html.replace("<body>", "<body>" + ReloadScript)
  return new TextEncoder().encode(reloadHtml)
}