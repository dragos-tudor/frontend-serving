import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "./MediaTypes.js"

const BAD_REQUEST = "Bad Request"

/**
 Create bad request http response
 * @returns Return http response.
*/
export const createBadRequestResponse = () => new Response(BAD_REQUEST, {
  headers: new Headers({
    [CONTENT_LENGTH]: BAD_REQUEST.length,
    [CONTENT_TYPE]: MediaTypes[HTML_EXT]
  }),
  status: 400
})