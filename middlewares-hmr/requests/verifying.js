import { getUrlPath } from "../../middlewares/mod.js"

const indexPaths = ["/", "/index.html", "/index.htm"]

export const isIndexFileRequest = (request) =>
  indexPaths.includes(getUrlPath(request))

export const isWatchRequest = (request) =>
  getUrlPath(request).endsWith("/watch")