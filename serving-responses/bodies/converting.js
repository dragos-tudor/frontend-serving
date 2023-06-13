import { existsBody, isStringBody } from "./verifyimg.js"

export const toJsonBody = (body) =>
  (isStringBody(body) && body) ||
  (existsBody(body) && JSON.stringify(body)) ||
  null
