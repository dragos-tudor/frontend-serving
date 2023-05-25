import { CONTENT_LENGTH, CONTENT_TYPE, HTML_EXT } from "./Constants.js"
import { MediaTypes } from "./MediaTypes.js"

/**
 Create not modified http response
 * @returns Return http response.
*/
export const createNotModifiedResponse = () => new Response(null, {
  headers: new Headers({
    [CONTENT_LENGTH]: 0,
    [CONTENT_TYPE]: MediaTypes[HTML_EXT],
  }),
  status: 304
})