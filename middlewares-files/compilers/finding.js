import { getFileExtension } from "../files/getting.js"
import { existsFileCompiler } from "./verifying.js"

export const findFileCompiler = (compilers, filePath) => compilers.find(compiler => existsFileCompiler(compiler, getFileExtension(filePath)))