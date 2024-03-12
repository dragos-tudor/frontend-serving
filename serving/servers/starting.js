import { logInfo } from "../../serving-loggers/mod.js"
import { ContextOptions } from "../options/ContextOptions.js"
import { ServerOptions } from "../options/ServerOptions.js"
import { addAbortSignalOptions } from "../options/adding.js"
import { ensureDefaultOptions } from "../options/ensuring.js"
import { isTlsServer } from "./verifying.js"

/**
 * Start http server.
 * @param {function} requestHandler Server handler.
 * @param {object} [options] Server options.
 * @returns {{close: function}} Return http server.
*/
export const startServer = (requestHandler, options = ServerOptions) => {
  const serverOptions = ensureDefaultOptions(ServerOptions, options)
  const contextOptions = ensureDefaultOptions(ContextOptions, options.context)

  const startMessage = `${isTlsServer(options)?"https":"http"}://${options.hostname}:${options.port}`
  logInfo(true, "server address", startMessage)
  logInfo(true, "current working directory", contextOptions.cwd)

  const abortCtrl = new AbortController()
  addAbortSignalOptions(serverOptions, abortCtrl)

  Deno.serve(serverOptions, (request) => requestHandler(request, contextOptions))
  return {close: () => abortCtrl.abort()}
}