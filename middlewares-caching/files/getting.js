
export const getFileInfo = (dir, url) => Deno.stat(`${dir}${url}`)