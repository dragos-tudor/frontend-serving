
export const isTlsServer = (options) =>
  "certFile" in options || "cert" in options