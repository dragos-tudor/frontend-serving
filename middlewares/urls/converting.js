import { getUrlSearchParams } from "./getting.js"

const reduceSearchParams = (obj, param) => {
  const [name, value] = decodeURIComponent(param).split("=")
  return Object.assign(obj, {[name]: value})
}

export const toUrlSearchParamsObj = (request) =>
  getUrlSearchParams(request)
    .replace("?", "")
    .split("&")
    .reduce(reduceSearchParams, {})