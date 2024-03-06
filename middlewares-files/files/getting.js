import { extname } from "../../deps.js"

export const getFileExtension = (fileName) => extname(fileName)

export const getFilePath = (cwd, url) => `${cwd}${url}`

export const getFileUri = (filePath) => filePath.replace("file://", "")