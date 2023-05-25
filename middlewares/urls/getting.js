
export const getUrlPath = (request) => {
  const url = new URL(request.url)
  return url.pathname === "/"?
    "/index.html":
    url.pathname
}

export const getUrlSearchParams = (request) =>
  new URL(request.url).search