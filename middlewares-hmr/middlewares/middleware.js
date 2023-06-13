import { createIndexFileResponse } from "../responses/creating.js"
import { isWatchRequest, isRootFileRequest } from "../requests/verifying.js"
import { upgradeWatchFilesSocket } from "../sockets/upgrading.js"

export const hmrMiddleware = (next) => (request, context = {}) =>
  (isRootFileRequest(request) && createIndexFileResponse(next, request, context)) ||
  (isWatchRequest(request) && upgradeWatchFilesSocket(request, context)) ||
  next(request, context)
