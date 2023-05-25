import { getUrlPath, getUrlSearchParams } from "../../middlewares/mod.js"

export const isEvalRequest = (request) =>
  getUrlPath(request).endsWith("/eval")

export const isEvalCodeRequest = (request) =>
  isEvalRequest(request) &&
  getUrlSearchParams(request) === ""