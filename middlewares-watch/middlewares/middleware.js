import { IndexHtml } from "../../middlewares/mod.js"
import { createIndexFileResponse } from "../responses/creating.js"
import { isIndexFileRequest, isRouteRequest, isWatchRequest } from "../requests/verifying.js"
import { upgradeWatchFilesSocket } from "../sockets/upgrading.js"

export const watchMiddleware = (next) => (request, context = {}) =>
  (isIndexFileRequest(request) && createIndexFileResponse(next, request, context)) ||
  (isWatchRequest(request) && upgradeWatchFilesSocket(request, context)) ||
  (isRouteRequest(request) && createIndexFileResponse(next, {...request, url: IndexHtml}, context)) ||
  next(request, context)
