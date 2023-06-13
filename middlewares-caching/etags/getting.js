import { toHexString } from "./converting.js"

const getEncodedTag = (lastModified, size) => {
  const jsonLastModified = new Date(lastModified).toJSON();
  const rawEtag = `${jsonLastModified}${size}`;
  const encodedEtag = new TextEncoder().encode(rawEtag);
  return encodedEtag;
}

const getHexStringTag = async (encodedEtag) => {
  const hashType = "SHA-1";
  const hashBuffer = await crypto.subtle.digest(hashType, encodedEtag);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(toHexString).join("");
}

export const getFileEtag = async (lastModified, size) => {
  const encodedRawEtag = getEncodedTag(lastModified, size)
  return await getHexStringTag(encodedRawEtag)
}



