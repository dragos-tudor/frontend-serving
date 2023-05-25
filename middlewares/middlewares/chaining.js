import { createNotFoundResponse } from "../../serving-responses/mod.js"

export const chainMiddlewares = (middlewares) =>
  middlewares.length?
    Array.from(middlewares)
     .reverse()
     .reduce((acc, middleware) => middleware(acc), createNotFoundResponse):
    createNotFoundResponse