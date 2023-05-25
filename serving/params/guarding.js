import { isFunction, isInstanceType, isNullOrUndefined, isString, isTypeOf } from "./verifying.js"

export const guardParam = (name, value, type) => {
  if(isNullOrUndefined(value)) throw new Error(`Param '${name}' value is null or undefined.`)
  if(isFunction(type) && !isInstanceType(value, type)) throw new Error(`Param '${name}' value expect instance of '${type.name}'.`)
  if(isString(type) && !isTypeOf(value, type)) throw new Error(`Param '${name}' expect type '${type}'`)
  return true
}