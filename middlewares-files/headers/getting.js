import { MediaTypes } from "../../serving-responses/mod.js"
import { isGzipFile } from "../files/verifying.js"

export const getFileHeaders = (fileContent, fileExtension) => {
  const headers = new Headers()
  const mediaType = MediaTypes[fileExtension]

  headers.set("content-length", fileContent.length.toString())
  headers.set("content-type", mediaType||"application/octet-stream")

  if(isGzipFile(fileContent))
    headers.set("content-encoding", "gzip")
  return headers
}