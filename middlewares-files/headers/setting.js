
export const setHeaderContentLength = (headers, fileContent) => headers.set("content-length", fileContent.length.toString())

export const setHeaderContentType = (headers, mediaType) => headers.set("content-type", mediaType||"application/octet-stream")

export const setHeaderContentEncoding = (headers, encoding) => headers.set("content-encoding", encoding)