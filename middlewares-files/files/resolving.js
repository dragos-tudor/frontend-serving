
export const resolveFileContent = (filePath, compiler) =>
  compiler?
    compiler.compileFile(filePath):
    Deno.readFile(filePath)
