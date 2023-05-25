
export const changeLocation = (location) => (msg) => {
  if(msg.name !== "reload") return location
  if(location.pathname === "/") {
   location.href = `${location.origin}${location.search}`
   return location
  }

  const search = location.search.replace("?", "&")
  const reloadUrl = encodeURIComponent(location.pathname)
  const reloadFile = encodeURIComponent(msg.payload)
  location.href = `${location.origin}?reloadUrl=${reloadUrl}${search}&reloadFile=${reloadFile}`
  return location
}