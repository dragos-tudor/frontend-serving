import { toHexString } from "./converting.js"

export const getFileEtag = async (lastModified, size) => {
  const jsonLastModified = new Date(lastModified).toJSON()
  const rawEtag = `${jsonLastModified}${size}`
  const encodedRawEtag = new TextEncoder().encode(rawEtag)

  const hashType = "SHA-1"
  const hashBuffer = await crypto.subtle.digest(hashType, encodedRawEtag)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const etag = hashArray.map(toHexString).join("")

  return etag
}