import { RootPath } from "./RootPath.js"

export const isRootPath = (request) => new URL(request.url).pathname === RootPath