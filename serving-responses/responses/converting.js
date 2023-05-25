
export const toJsonBody = (body) => {
  if(typeof body === "string") return body
  if(body != undefined) return JSON.stringify(body)
  return null
}