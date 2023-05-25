// deno-lint-ignore-file valid-typeof

export const isFunction = type => typeof type  === "function"
export const isInstanceType = (value, type) => value instanceof type
export const isNullOrUndefined = (value) => value == undefined
export const isString = type => typeof type  === "string"
export const isTypeOf = (value, type) => typeof value === type