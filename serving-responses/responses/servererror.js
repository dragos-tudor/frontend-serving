import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "../media-types/MediaTypes.js"

const SERVER_ERROR = "Internal server error"
const SERVER_ERROR_HEADER = "X-Server-Error"

const getServerMessage = (message) => message ?? SERVER_ERROR

/**
 Create server error http response
 * @param {string} message Error message.
 * @returns Return http response.
*/
export const createServerErrorResponse = (message) =>
  new Response(getServerMessage(message), {
    headers: new Headers({
      [CONTENT_LENGTH]: getServerMessage(message).length,
      [CONTENT_TYPE]: MediaTypes[HTML_EXT],
      [SERVER_ERROR_HEADER]: getServerMessage(message)
    }),
    status: 500
  })