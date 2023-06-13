import { sendWebSocketEvent } from "../../serving-websockets/mod.js"
import { debounceExec } from "./debouncing.js"

export const sendReloadMessage = (socket, cwd) => debounceExec(paths => sendWebSocketEvent(socket, "reload", paths[0].replace(cwd, "")), 300)