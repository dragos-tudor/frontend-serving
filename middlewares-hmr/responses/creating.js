import { createOkResponse } from "../../serving-responses/mod.js"
import { setContentLengthHeader } from "../headers/setting.js"
import { injectReloadScript } from "../scripts/injecting.js"

export const createIndexFileResponse = async (next, request, context) => {
  const fileResponse = await next(request, context)
  const reloadHtml = await injectReloadScript(fileResponse)

  setContentLengthHeader(fileResponse.headers, reloadHtml.length)
  return createOkResponse(reloadHtml, fileResponse.headers)
}