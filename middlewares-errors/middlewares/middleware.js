import { logError } from "../../serving-loggers/mod.js"
import { getErrorType } from "../errors/getting.js"
import { createErrorResponse } from "../responses/creating.js"

const SERVER_ERROR_HEADER = "X-Server-Error"

export const errorsMiddleware = (next) => async (request, context = {}) => {
  const {logEnabled} = context
  try {
    const response = await next(request, context)
    if(response.status === 500)
      logError(logEnabled, response.headers.get(SERVER_ERROR_HEADER))
    return response
  }
  catch (error) {
    logError(logEnabled, error)
    const errorType = getErrorType(error) || "serverError"
    return createErrorResponse[errorType](error.message)
  }
}