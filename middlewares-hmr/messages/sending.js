import { sendWebSocketEvent } from "../../serving-websockets/mod.js"
import { debounceExec } from "./debouncing.js"

export const sendReloadMessage = (socket, dir) =>
  debounceExec(paths =>
    sendWebSocketEvent(socket, "reload", paths[0].replace(dir, "")),
  300)