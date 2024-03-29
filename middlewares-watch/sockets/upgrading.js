import { upgradeWebSocket } from "../../serving-websockets/mod.js"
import { watchFiles } from "../files/watching.js"
import { sendReloadMessage } from "../messages/sending.js"

export const upgradeWatchSocket = (request, context) => {
  const {cwd, watchDelay} = context
  const watcher = Deno.watchFs(cwd)

  const { socket, response } = upgradeWebSocket(request, watcher, context)
  watchFiles(watcher, sendReloadMessage(socket, cwd, watchDelay))

  return response
}