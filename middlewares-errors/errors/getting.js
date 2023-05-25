import { ErrorTypes } from "./ErrorTypes.js"

export const getErrorType = (error) => {
  if (error instanceof URIError) return ErrorTypes.badRequest
  if (error instanceof Deno.errors.NotFound) return ErrorTypes.notFound
  return ErrorTypes.serverError
}