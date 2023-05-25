import { tsCompiler, sassCompiler } from "./deps.js"
import { chainMiddlewares } from "./middlewares/mod.js"
import { cacheMiddleware } from "./middlewares-caching/mod.js"
import { errorsMiddleware } from "./middlewares-errors/mod.js"
import { evalMiddleware } from "./middlewares-evaluating/mod.js"
import { filesMiddleware } from "./middlewares-files/mod.js"
import { hmrMiddleware } from "./middlewares-hmr/mod.js"
import { startServer } from "./serving/mod.js"

const filesRequestHandler = chainMiddlewares([
  errorsMiddleware,
  cacheMiddleware,
  filesMiddleware([sassCompiler, tsCompiler])
])

const hmrRequestHandler = chainMiddlewares([
  errorsMiddleware,
  evalMiddleware,
  cacheMiddleware,
  hmrMiddleware,
  filesMiddleware([sassCompiler, tsCompiler])
])

export const startFileServer = (options) => startServer(filesRequestHandler, options)
export const startHmrServer = (options) => startServer(hmrRequestHandler, options)
export * from "./serving/mod.js"
export * from "./serving-responses/mod.js"
export { cacheMiddleware } from "./middlewares-caching/mod.js"
export { errorsMiddleware } from "./middlewares-errors/mod.js"
export { filesMiddleware } from "./middlewares-files/mod.js"
export { hmrMiddleware } from "./middlewares-hmr/mod.js"