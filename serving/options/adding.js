
export const addAbortSignalOptions = (options, abortCtrl) => Object.assign(options, { signal: abortCtrl.signal, onListen: () => {} })

export const addAlpnProtocolsOptions = (options) => Object.assign(options, {alpnProtocols: ["h2", "http/1.1"] })