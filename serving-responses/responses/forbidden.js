import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "./MediaTypes.js"

const FORBIDDEN = "forbidden"

/**
 Create forbidden http response
 * @returns Return http response.
*/
export const createForbiddenResponse = () => new Response(FORBIDDEN, {
  headers: new Headers({
    [CONTENT_LENGTH]: FORBIDDEN.length,
    [CONTENT_TYPE]: MediaTypes[HTML_EXT]
  }),
  status: 403
})