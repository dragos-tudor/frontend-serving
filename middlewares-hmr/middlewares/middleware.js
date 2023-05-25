import { createIndexFileResponse } from "../responses/creating.js"
import { isWatchRequest, isIndexFileRequest } from "../requests/verifying.js"
import { upgradeWatchFilesSocket } from "../sockets/upgrading.js"

export const hmrMiddleware = (next) => (request, context = {}) => {
  if(isIndexFileRequest(request)) return createIndexFileResponse(next, request, context)
  if(isWatchRequest(request)) return upgradeWatchFilesSocket(request, context)
  return next(request, context)
}