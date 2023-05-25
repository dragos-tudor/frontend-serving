import { changeLocation } from "../locations/changing.js"

export const connectWebSocket = (location, logger) => {
  const wsUrl = location.origin.replace("http", "ws")
  const wsClient = new WebSocket(wsUrl + "/watch")

  wsClient.onopen = () => logger.info("[serving]", "websocket is open")
  wsClient.onclose = () => logger.info("[serving]", "websocket is closed")
  wsClient.onerror = (ex) => logger.error("[serving]", "websocket error: ", ex)
  wsClient.onmessage = (msg) => changeLocation(location)(JSON.parse(msg.data))
  wsClient.beforeunload = () => wsClient.close()

  return wsClient
}