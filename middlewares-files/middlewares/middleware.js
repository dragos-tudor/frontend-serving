import { getUrlPath } from "../../middlewares/mod.js"
import { logInfo } from "../../serving-loggers/mod.js"
import { createNotFoundResponse } from "../../serving-responses/mod.js"
import { findFileCompiler } from "../compilers/finding.js"
import { getFileExtension, getFilePath } from "../files/getting.js"
import { resolveFileContent } from "../files/resolving.js"
import { isExistingFile } from "../files/verifying.js"
import { isFileRequest } from "../requests/verifying.js"
import { createFileResponse } from "../responses/creating.js"


export const filesMiddleware = (compilers = []) => (next) => async (request, context = {}) => {
  const {dir, logEnabled} = context

  if(isFileRequest(request) === false) return next(request, context)
  const filePath = getFilePath(dir, getUrlPath(request))

  if(!await isExistingFile(filePath)) return createNotFoundResponse()

  const compiler = findFileCompiler(filePath, compilers)
  const fileContent = await resolveFileContent(filePath, compiler)

  logInfo(logEnabled, `files middleware: ${getUrlPath(request)}`)
  return createFileResponse(fileContent, getFileExtension(filePath))
}