import { MediaTypes } from "../../serving-responses/mod.js"
import { isGzipFile } from "../files/verifying.js"
import { setHeaderContentEncoding, setHeaderContentLength, setHeaderContentType } from "./setting.js"

export const getFileHeaders = (fileContent, fileExtension) => {
  const headers = new Headers()
  const mediaType = MediaTypes[fileExtension]

  setHeaderContentLength(headers, fileContent)
  setHeaderContentType(headers, mediaType)
  if(isGzipFile(fileContent)) setHeaderContentEncoding(headers, "gzip")

  return headers
}