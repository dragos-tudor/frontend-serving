
export const isFileModified = (fileEtag, ifNoneMatchHeader) =>
  fileEtag?.replace("/W", "") !==
  ifNoneMatchHeader?.replace("W/", "")