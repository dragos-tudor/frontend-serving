
export const addAbortSignalOptions = (options, abortCtrl) =>
  Object.assign(options, { signal: abortCtrl.signal, onListen: () => {} })