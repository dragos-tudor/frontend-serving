import { existsBody, isStringBody } from "./verifying.js"

export const toJsonBody = (body) =>
  (isStringBody(body) && body) ||
  (existsBody(body) && JSON.stringify(body)) ||
  null
