import { isOpenWebSocket } from "./verifying.js"

export const sendWebSocketEvent = (socket, name, payload) =>
  isOpenWebSocket(socket) &&
  socket.send(JSON.stringify({name, payload}))