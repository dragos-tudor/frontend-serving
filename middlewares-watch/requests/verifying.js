import { extname } from "../../deps.js"
import { getUrlPath, IndexPaths } from "../../middlewares/mod.js"

export const isIndexFileRequest = (request) => IndexPaths.includes(getUrlPath(request))

export const isRouteRequest = (request) => !extname(getUrlPath(request))

export const isWatchRequest = (request) => getUrlPath(request).endsWith("/watch")