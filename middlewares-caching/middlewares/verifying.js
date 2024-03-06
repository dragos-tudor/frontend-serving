import { removeETagWeakValidator } from "../headers/removing.js";

export const isFileModified = (fileETag, ifNoneMatchHeader) =>
  removeETagWeakValidator(fileETag) !== removeETagWeakValidator(ifNoneMatchHeader)