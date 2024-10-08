import { exists } from "../../deps.js"

export const existsFile = (filePath) => exists(filePath)

export const isGzipFile = (fileContent) => fileContent[0] === 0x1F && fileContent[1] === 0x8B