import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "../media-types/MediaTypes.js"

const NOT_FOUND = "Not Found"

/**
 Create not found http response
 * @returns Return http response.
*/
export const createNotFoundResponse = () =>
  new Response(NOT_FOUND, {
    headers: new Headers({
      [CONTENT_LENGTH]: NOT_FOUND.length,
      [CONTENT_TYPE]: MediaTypes[HTML_EXT]
    }),
    status: 404
  })