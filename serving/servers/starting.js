import { serve, serveTls } from "../../deps.js"
import { logInfo } from "../../serving-loggers/mod.js"
import { ContextOptions } from "../options/ContextOptions.js"
import { ServerOptions } from "../options/ServerOptions.js"
import { addAbortSignalOptions, addAlpnProtocolsOptions } from "../options/adding.js"
import { ensureDefaultOptions } from "../options/ensuring.js"
import { guardParam } from "../params/guarding.js"
import { isTlsServer } from "./verifying.js"

/**
 * Start http server.
 * @param {function} requestHandler Server handler.
 * @param {object} [options] Server options.
 * @returns {{close: function}} Return http server.
*/
export const startServer = (requestHandler, options = ServerOptions) => {
  guardParam("handler", requestHandler, "function")
  const serverOptions = ensureDefaultOptions(ServerOptions, options)
  const contextOptions = ensureDefaultOptions(ContextOptions, options.context)

  const startMessage = `${isTlsServer(options)?"https":"http"}://${options.hostname}:${options.port}`
  logInfo(true, `server address: ${startMessage}`)

  const abortCtrl = new AbortController()
  addAbortSignalOptions(serverOptions, abortCtrl)

  isTlsServer(options)?
    serveTls((request) => requestHandler(request, contextOptions), addAlpnProtocolsOptions(serverOptions)):
    serve((request) => requestHandler(request, contextOptions), serverOptions)
  return {close: () => abortCtrl.abort()}
}