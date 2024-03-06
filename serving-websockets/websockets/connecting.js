
export const connectWebSocket = (location, logger) =>
{
  const getWebSocketServerUrl = (location) => location.origin.replace("http", "ws")
  const isReloadMessage = (msg) => toJsonObject(msg.data).name === "reload"
  const reloadLocation = (location) => location.reload()
  const toJsonObject = (data) => JSON.parse(data ?? "{}")

  const sockerServerUrl = getWebSocketServerUrl(location)
  const socketClient = new WebSocket(sockerServerUrl + "/watch")

  socketClient.onopen = () => logger.info("[serving]", "client websocket is open")
  socketClient.onclose = () => logger.info("[serving]", "client websocket is closed")
  socketClient.onerror = (ex) => logger.error("[serving]", "client websocket error", ex)
  socketClient.onmessage = (msg) => { logger.info("[serving]", "client websocket message", msg.data);
    isReloadMessage(msg) && reloadLocation(location)
  }
  socketClient.beforeunload = () => socketClient.close()

  return socketClient
}