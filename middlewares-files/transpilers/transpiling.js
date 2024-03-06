import { transpile } from "../../deps.js"
import { getFileUri } from "../files/getting.js"
import { getTranspiledCode } from "./getting.js"

export const tsExtensions = [".jsx", ".ts", ".tsx"]

export const transpileTsFile = async (filePath) =>
{
  const fileUri = getFileUri(filePath)
  const transpilerMap = await transpile(fileUri)
  const code = getTranspiledCode(filePath, transpilerMap)
  return code;
}