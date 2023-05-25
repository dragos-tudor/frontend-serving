import { extname } from "../../deps.js"
import { getUrlPath } from "../../middlewares/mod.js"

const isRootFileRequest = (request) =>
  getUrlPath(request) === "/"

export const isFileRequest = (request) =>
  isRootFileRequest(request) ||
  !!extname(getUrlPath(request))