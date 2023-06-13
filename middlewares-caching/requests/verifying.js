import { isFileRequest } from "../../middlewares-files/mod.js"

const isGetRequest = (request) => request.method.toUpperCase() === "GET"

export const isFileCacheRequest = (request) => isFileRequest(request) && isGetRequest(request)