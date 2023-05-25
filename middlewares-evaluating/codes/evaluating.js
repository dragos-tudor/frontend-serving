import { createServerErrorResponse, createOkResponse } from "../../serving-responses/mod.js"
import { getFileHeaders } from "../../middlewares-files/mod.js"

export const evalCode = async (request) => {
  const evalJsx = await request.text()
  const evalOptions = { args: [ "eval", "--ext=jsx", evalJsx ] }
  const execPath = Deno.execPath()

  const command = new Deno.Command(execPath, evalOptions)
  const { code, stdout, stderr } = await command.output()
  const content = code === 0?
    new TextDecoder().decode(stdout):
    new TextDecoder().decode(stderr)

  return code === 0?
    createOkResponse(content, getFileHeaders(content, ".html")):
    createServerErrorResponse(content)
}