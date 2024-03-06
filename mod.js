import { chainMiddlewares } from "./middlewares/mod.js"
import { cacheMiddleware } from "./middlewares-caching/mod.js"
import { errorsMiddleware } from "./middlewares-errors/mod.js"
import { createCompiler, filesMiddleware, transpileTsFile, tsExtensions } from "./middlewares-files/mod.js"
import { watchMiddleware } from "./middlewares-watch/mod.js"
import { startServer } from "./serving/mod.js"

const filesRequestHandler = chainMiddlewares([
  errorsMiddleware,
  cacheMiddleware,
  filesMiddleware([createCompiler(transpileTsFile, tsExtensions)])
])

const liveServerRequestHandler = chainMiddlewares([
  errorsMiddleware,
  cacheMiddleware,
  watchMiddleware,
  filesMiddleware([createCompiler(transpileTsFile, tsExtensions)])
])

export const startFileServer = (options) => startServer(filesRequestHandler, options)
export const startLiveServer = (options) => startServer(liveServerRequestHandler, options)
export * from "./serving/mod.js"
export * from "./serving-responses/mod.js"
export { chainMiddlewares } from "./middlewares/mod.js"
export { cacheMiddleware } from "./middlewares-caching/mod.js"
export { errorsMiddleware } from "./middlewares-errors/mod.js"
export { filesMiddleware } from "./middlewares-files/mod.js"
export { watchMiddleware } from "./middlewares-watch/mod.js"
