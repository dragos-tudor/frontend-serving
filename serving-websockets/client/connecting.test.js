import { spy, assertSpyCalls } from "/mock.ts"
import { startServer } from "../../serving/mod.js"
import { sendWebSocketEvent } from "../server/sending.js"
import { upgradeWebSocket } from "../server/upgrading.js"
import { connectWebSocket } from "./connecting.js"


const startTestServer = (func, options) =>
  startServer((request) => {
    const { socket, response } = upgradeWebSocket(request, undefined, options.context)
    func(socket)
    return response
  }, options)

const waitFor = (func, retries = 10) => new Promise((resolve, reject) => {
  const interval = setInterval(() => {
    if(--retries < 0) {
      clearInterval(interval)
      return reject("waitFor timeout")
    }
    if(func()) {
      clearInterval(interval)
      return resolve()
    }
  }, 200)
})


Deno.test("connected socket client => socket server send reload message => socket client reload location", async () => {
  let server; let socketClient; let socketServer
  try {
    server = startTestServer(socket => socketServer = socket, {hostname: "localhost", port: 9090})
    const location = Object.assign(new URL("http://localhost:9090"), {reload: spy(() => {})})

    socketClient = connectWebSocket(location, console)
    await waitFor(() => socketClient.readyState === WebSocket.OPEN)

    sendWebSocketEvent(socketServer, "reload", 1)
    await waitFor(() => location.reload.calls.length > 0)
    assertSpyCalls(location.reload, 1)
  }
  finally{
    socketServer?.close()
    await waitFor(() => socketServer.readyState === WebSocket.CLOSED)

    socketClient?.close()
    await waitFor(() => socketClient.readyState === WebSocket.CLOSED)

    server?.close()
  }

})