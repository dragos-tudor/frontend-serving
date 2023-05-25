import { getFileExtension } from "../files/getting.js"

export const findFileCompiler = (filePath, compilers) =>
  compilers.find(compiler =>
    compiler.extensions?.includes(getFileExtension(filePath)))