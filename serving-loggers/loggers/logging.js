import { red, green } from "../../deps.js"

const getTimeNow = () => new Date().toISOString()

export const logInfo = (enabled, ...params) => enabled && console.info(green("[serving]"), getTimeNow(), ...params)

export const logError = (enabled, error) => enabled && console.error(red("[serving]"), getTimeNow(), error)
