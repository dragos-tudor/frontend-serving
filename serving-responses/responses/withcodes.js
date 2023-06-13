import { CONTENT_LENGTH, CONTENT_TYPE } from "./Constants.js"
import { toJsonBody } from "../bodies/converting.js"
import { MediaTypes } from "../media-types/MediaTypes.js"

/**
 Create http response
 * @param {string | Uint8Array | null} body Http response body.
 * @param {string} contentType Http response content type.
 * @param {number} statusCode Http response status.
 * @returns Return http response.
*/
export const createResponse = (body, contentType, statusCode = 200) =>
  new Response(body, {
    headers: new Headers({
      [CONTENT_LENGTH]: (body?.length ?? 0).toString(),
      [CONTENT_TYPE]: contentType
    }),
    status: statusCode
  })

/**
 Create http json response
 * @param body Http response body.
 * @param {number} statusCode Http response status.
 * @returns Return http json response.
*/
export const createJsonResponse = (body, statusCode = 200) =>
  createResponse(
    toJsonBody(body),
    MediaTypes[".json"],
    statusCode
  )
