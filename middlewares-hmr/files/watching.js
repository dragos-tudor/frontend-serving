import { isModifiedFileEvent } from "./verifying.js"

export const watchFiles = async (watcher, func) => {
  for await (const event of watcher) {
    if(isModifiedFileEvent(event))
      func(event.paths)
  }
}