
export const setETagHeader = (headers, etag) =>
  headers.set("ETag", etag)