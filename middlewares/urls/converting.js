import { getUrlSearchParams } from "./getting.js"

const setSearchParam = (obj, param) => {
  const [name, value] = decodeURIComponent(param).split("=")
  return Object.assign(obj, {[name]: value})
}

export const toSearchParams = (request) =>
  getUrlSearchParams(request)
    .replace("?", "")
    .split("&")
    .reduce(setSearchParam, {})