import { sendWebSocketEvent } from "../../serving-websockets/mod.js"
import { toUrlPath } from "../files/converting.js"
import { debounceExec } from "./debouncing.js"

export const sendReloadMessage = (socket, cwd, delay) =>
  debounceExec(
    filePaths => sendWebSocketEvent(socket, "reload", toUrlPath(filePaths[0], cwd)),
    delay)


