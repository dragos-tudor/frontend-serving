import { upgradeWebSocket } from "../../serving-websockets/mod.js"
import { watchFiles } from "../files/watching.js"
import { sendReloadMessage } from "../messages/sending.js"

export const upgradeWatchFilesSocket = (request, context) => {
  const {dir} = context
  const watcher = Deno.watchFs(dir)

  const { socket, response } = upgradeWebSocket(request, watcher, context)
  watchFiles(watcher, sendReloadMessage(socket, dir))

  return response
}