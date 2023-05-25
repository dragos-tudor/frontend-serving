import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "./MediaTypes.js"

const UNAUTHORIZED = "Unauthorized"

/**
 Create unauthorized http response
 * @returns Return http response.
*/
export const createUnauthorizedResponse = () => new Response(UNAUTHORIZED, {
  headers: new Headers({
    [CONTENT_LENGTH]: UNAUTHORIZED.length,
    [CONTENT_TYPE]: MediaTypes[HTML_EXT]
  }),
  status: 401
})