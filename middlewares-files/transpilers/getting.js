
export const getTranspiledCode = (fileUri, transpilerMap) =>
  transpilerMap.get("file://" + fileUri)