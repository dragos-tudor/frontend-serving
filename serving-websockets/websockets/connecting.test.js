import { assertStringIncludes } from "/asserts.ts"
import { spy, assertSpyCallArg } from "/mock.ts"
import { startServer } from "../../serving/mod.js"
import { connectWebSocket } from "./connecting.js"
import { sendWebSocketEvent } from "./sending.js"
import { upgradeWebSocket } from "./upgrading.js"


const startTestServer = (func, options) =>
  startServer((request) => {
    const { socket, response } = upgradeWebSocket(request)
    func(socket)
    return response
  }, options)

const waitFor = (func, retries = 100) => new Promise((resolve, reject) => {
  const interval = setInterval(() => {
    if(--retries < 0) {
      clearInterval(interval)
      return reject("waitFor timeout")
    }
    if(func()) {
      clearInterval(interval)
      return resolve()
    }
  }, 20)
})


Deno.test("server socket => start client socket => client socket start receiving reload messages", async () => {
  let server; let clientSocket; let serverSocket
  try {
    const location = new URL("http://localhost:9090/test")
    const logger = { info: spy(() => {}), error: console.error }

    server = startTestServer(socket => serverSocket = socket, {hostname: "localhost", port: 9090})
    clientSocket = connectWebSocket(location, logger)
    await waitFor(() => clientSocket.readyState === WebSocket.OPEN)
    assertSpyCallArg(logger.info, 0, 1, "websocket is open")

    sendWebSocketEvent(serverSocket, "reload")
    await waitFor(() => !location.href.includes("/test"))
    assertStringIncludes(location.href, location.origin + "/?reloadUrl=%2Ftest")
  }
  finally{
    clientSocket?.close()
    serverSocket?.close()
    server?.close()
  }

})