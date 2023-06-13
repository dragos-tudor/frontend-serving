import { isRootPath } from "./verifying.js"
import { RootHtml } from "./RootHtml.js"

const getUrlPathName = (url) => new URL(url).pathname

const getUrlSearch = (url) => new URL(url).search

export const getUrlPath = (request) => isRootPath(request)? RootHtml: getUrlPathName(request.url)

export const getUrlSearchParams = (request) => getUrlSearch(request.url)