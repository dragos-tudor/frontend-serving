
const defaultDelay = 1000

export const debounceExec = (func, delay) => {
  let timeoutId = 0
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() =>
      (clearTimeout(timeoutId), func(...args)),
      delay ?? defaultDelay)
  }
}