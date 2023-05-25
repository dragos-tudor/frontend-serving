import { createOkResponse, createNoContentResponse } from "../../serving-responses/mod.js"
import { getFileHeaders } from "../headers/getting.js"

export const createFileResponse = (fileContent, fileExtension) =>
  fileContent.length?
    createOkResponse(fileContent, getFileHeaders(fileContent, fileExtension)):
    createNoContentResponse()