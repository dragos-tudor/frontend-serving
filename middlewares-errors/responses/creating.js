import { createBadRequestResponse, createNotFoundResponse, createServerErrorResponse } from "../../serving-responses/mod.js"

export const createErrorResponse = Object.freeze({
  "badRequest": createBadRequestResponse,
  "notFound": createNotFoundResponse,
  "serverError": createServerErrorResponse
})