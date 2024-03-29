import { IndexHtml } from "../../middlewares/mod.js"
import { createIndexFileResponse } from "../responses/creating.js"
import { isIndexFileRequest, isRouteRequest, isWatchRequest } from "../requests/verifying.js"
import { upgradeWatchSocket } from "../sockets/upgrading.js"

export const watchMiddleware = (next) => (request, context = {}) =>
  (isIndexFileRequest(request) && createIndexFileResponse(next, request, context)) ||
  (isWatchRequest(request) && upgradeWatchSocket(request, context)) ||
  (isRouteRequest(request) && createIndexFileResponse(next, {...request, url: IndexHtml}, context)) ||
  next(request, context)
