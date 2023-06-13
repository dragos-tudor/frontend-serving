import { createNotFoundResponse } from "../../serving-responses/mod.js"

export const chainMiddlewares = (middlewares, lastMiddleware = createNotFoundResponse) =>
  Array.from(middlewares)
    .reverse()
    .reduce((acc, middleware) => middleware(acc), lastMiddleware)