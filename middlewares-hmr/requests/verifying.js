import { getUrlPath } from "../../middlewares/mod.js"

const RootHtmls = ["/", "/index.html", "/index.htm"]

export const isRootFileRequest = (request) => RootHtmls.includes(getUrlPath(request))

export const isWatchRequest = (request) => getUrlPath(request).endsWith("/watch")