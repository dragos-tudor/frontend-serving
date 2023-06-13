
export const getFileInfo = (cwd, url) => Deno.stat(`${cwd}${url}`)