import { RootPath } from "../indexes.js"
import { getUrlPathName } from "./getting.js"

const RootPaths = ["", RootPath]

export const isRootPath = (request)=>RootPaths.includes(getUrlPathName(request.url));