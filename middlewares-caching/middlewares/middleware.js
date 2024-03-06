import { getUrlPath } from "../../middlewares/mod.js"
import { logInfo } from "../../serving-loggers/mod.js"
import { createNotModifiedResponse } from "../../serving-responses/mod.js"
import { getFileEtag } from "../etags/getting.js"
import { getFileInfo } from "../files/getting.js"
import { existsLastModifiedDate } from "../files/verifying.js"
import { getIfNoneMatchHeader } from "../headers/getting.js"
import { setETagHeader } from "../headers/setting.js"
import { isFileCacheRequest } from "../requests/verifying.js"
import { isFileModified } from "./verifying.js"

export const cacheMiddleware = (next) => async (request, context = {}) => {
  const {cwd, logEnabled} = context

  if(!isFileCacheRequest(request)) return next(request, context)
  const fileInfo = await getFileInfo(cwd, getUrlPath(request))

  if(!existsLastModifiedDate(fileInfo.mtime)) return next(request. context)
  const fileEtag = await getFileEtag(fileInfo.mtime, fileInfo.size)

  const ifNoneMatchHeader = getIfNoneMatchHeader(request.headers)
  const isModified = isFileModified(fileEtag, ifNoneMatchHeader)

  if(!isModified) logInfo(logEnabled, "cache middleware:", getUrlPath(request))
  if(!isModified) return createNotModifiedResponse()

  const response = await next(request, context)
  setETagHeader(response.headers, fileEtag)
  return response
}