import { red, green } from "../../deps.js"

const getTimeNow = () => new Date(Date.now()).toISOString()

export const logInfo = (enabled, ...args) => enabled && console.info(green("[serving]"), getTimeNow(), ...args)

export const logError = (enabled, error) => enabled && console.error(red("[serving]"), getTimeNow(), error)
