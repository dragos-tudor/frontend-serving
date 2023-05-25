import { extname } from "../../deps.js"

export const getFileExtension = (fileName) => extname(fileName)

export const getFileInfo = (dir, url) => Deno.stat(`${dir}${url}`)

export const getFilePath = (dir, url) => `${dir}${url}`