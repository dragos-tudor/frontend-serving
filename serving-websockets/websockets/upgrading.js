import { logError, logInfo } from "../../serving-loggers/mod.js"

export const upgradeWebSocket = (request, resource, context = {}) => {
  const {socket, response} = Deno.upgradeWebSocket(request)

  socket.onopen = () => logInfo(context.logEnabled, "server websocket has been open.")
  socket.onerror = (error) => logError(context.logEnabled, "server websocket error", error)
  socket.onclose = () => { resource?.close(); logInfo(context.logEnabled, "server websocket has been closed.") }

  return { socket, response }
}