import { createBadRequestResponse, createNotFoundResponse, createServerErrorResponse } from "../../serving-responses/mod.js"
import { ErrorTypes } from "../errors/ErrorTypes.js"
import { getErrorType } from "../errors/getting.js"

export const createErrorResponse = (error) => {
  const errorType = getErrorType(error)
  switch(errorType) {
    case ErrorTypes.badRequest: return createBadRequestResponse()
    case ErrorTypes.notFound: return createNotFoundResponse()
    case ErrorTypes.serverError: return createServerErrorResponse(error.message)
    default: return createServerErrorResponse()
  }
}