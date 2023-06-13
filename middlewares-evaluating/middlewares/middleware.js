import { toSearchParams } from "../../middlewares/mod.js"
import { getFileHeaders } from "../../middlewares-files/mod.js"
import { createOkResponse } from "../../serving-responses/mod.js"
import { evalCode } from "../codes/evaluating.js"
import { isEvalRequest, isEvalCodeRequest } from "../requests/verifying.js"
import { getEvalScript } from "../scripts/getting.js"

export const evalMiddleware = (next) => (request, context = {}) => {
  if(!isEvalRequest(request)) return next(request, context)
  if(isEvalCodeRequest(request)) return evalCode(request)

  const params = toSearchParams(request)
  const evalScript = getEvalScript(params.source, params.target)
  return createOkResponse(evalScript, getFileHeaders(evalScript, ".js"))
}