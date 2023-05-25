import { logError, logInfo } from "../../serving-loggers/mod.js"

export const upgradeWebSocket = (request, resource, context = {}) => {
  const {socket, response} = Deno.upgradeWebSocket(request)
  const {logEnabled} = context

  socket.onopen = () => logInfo(logEnabled, "websocket has been open.")
  socket.onclose = () => { resource?.close(); logInfo(logEnabled, "websocket has been closed.") }
  socket.onerror = (error) => { logError(logEnabled, error) }

  return { socket, response }
}