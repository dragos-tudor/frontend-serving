import { IndexHtml } from "../indexes.js"
import { isRootPath } from "./verifying.js"

const getUrlSearch = (url) => new URL(url).search

export const getUrlPath = (request) => isRootPath(request)? IndexHtml: getUrlPathName(request.url)

export const getUrlPathName = (url)=> url.startsWith("http")? new URL(url).pathname: url

export const getUrlSearchParams = (request) => getUrlSearch(request.url)