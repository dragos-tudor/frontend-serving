
export const debounceExec = (func, delay = 300) => {
  let timeoutId = 0
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      clearTimeout(timeoutId)
      func(...args)
    }, delay)
  }
}