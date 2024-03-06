
const CONTENT_LENGTH = "content-length"

export const setContentLengthHeader = (headers, length) => headers.set(CONTENT_LENGTH, length)