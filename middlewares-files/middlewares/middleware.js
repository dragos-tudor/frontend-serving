import { getUrlPath } from "../../middlewares/mod.js"
import { logInfo } from "../../serving-loggers/mod.js"
import { createNotFoundResponse } from "../../serving-responses/mod.js"
import { findFileCompiler } from "../compilers/finding.js"
import { getFileExtension, getFilePath } from "../files/getting.js"
import { existsFile } from "../files/verifying.js"
import { isFileRequest } from "../requests/verifying.js"
import { createFileResponse } from "../responses/creating.js"


export const filesMiddleware = (compilers = []) => (next) => async (request, context = {}) => {
  const {cwd, logEnabled} = context

  if(isFileRequest(request) === false) return next(request, context)
  const filePath = getFilePath(cwd, getUrlPath(request))

  if(!await existsFile(filePath)) return createNotFoundResponse()

  const compiler = findFileCompiler(compilers, filePath)
  const fileContent = await (compiler?.compileFile || Deno.readFile)(filePath)

  logInfo(logEnabled, "files middleware:", getUrlPath(request))
  return createFileResponse(fileContent, getFileExtension(filePath))
}