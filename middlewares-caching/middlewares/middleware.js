import { getUrlPath } from "../../middlewares/mod.js"
import { logInfo } from "../../serving-loggers/mod.js"
import { createNotModifiedResponse } from "../../serving-responses/mod.js"
import { getFileEtag } from "../etags/getting.js"
import { getFileInfo } from "../files/getting.js"
import { isExistingLastModifiedDate } from "../files/verifying.js"
import { getIfNoneMatchHeader } from "../headers/getting.js"
import { setETagHeader } from "../headers/setting.js"
import { isFileCacheRequest } from "../requests/verifying.js"
import { isFileModified } from "./verifying.js"

export const cacheMiddleware = (next) => async (request, context = {}) => {
  const {dir, logEnabled} = context

  if(!isFileCacheRequest(request)) return next(request, context)
  const fileInfo = await getFileInfo(dir, getUrlPath(request))

  if(!isExistingLastModifiedDate(fileInfo.mtime)) return next(request. context)
  const fileEtag = await getFileEtag(fileInfo.mtime, fileInfo.size)

  const ifNoneMatchHeader = getIfNoneMatchHeader(request.headers)
  const fileModified = isFileModified(fileEtag, ifNoneMatchHeader)

  if(!fileModified) logInfo(logEnabled, `cache middleware: ${getUrlPath(request)}`)
  if(!fileModified) return createNotModifiedResponse()

  const response = await next(request, context)
  setETagHeader(response.headers, fileEtag)
  return response
}