## Frontend http server library
- Deno-based http development server [Node-free].
- functional-style library [OOP-free].
- single library, mono repo.

### Usage
```javascript
import { startLiveServer } from "./serving.js"
import settings from "./settings.json" with { type: "json" }

const resolveCwd = () => Deno.args[0] ?? import.meta.dirname
const importMap = resolveCwd() + "/deps.map.json"
const contextOptions = {cwd: resolveCwd(), transpilerOptions: {importMap}})

startLiveServer({...settings.serverOptions, contextOptions})
```

### [Serving library](./serving/)
- used as *Live server* for integration testing.
- used as *file server* for simple app/files servers.

### [Files middleware](./middlewares-files/)
- handle file requests.
- use plugin arhitecture to inject compilers:
  - compile/transpile ts files [`.jsx, .ts, .tsx`] to `js` file.
  - compile/transpile sass files [`.sass, .scss`] to `css` file [wip].
- should be used as final middleware.
- could be used as standalone middleware for files server.

### [Caching middleware](./middlewares-caching/)
- handle file requests sending `304` http response for unmodified files.
- based on specific caching headers.
- use action-pattern matching.
- should be used before files middleware.
- not intent to be used without files middleware.

### [Watch middleware](./middlewares-watch/)
- handle *watch* requests accepting client websocket connections.
- based on websocket bidirectional server-client communication.
- watch for files changes sending *reload* command to client.
- handle `index.html` requests injecting reloading script in index files responses.
- should be used before files middleware.
- not intent to be used without files middleware.

### [Errors middleware](./middlewares-errors/)
- handle and log uncatched errors.
- should be the first middleware.

### Observations
- based on *middlewares architecture* [similar to ASPNET midlewares].
- middlewares are chained to build request/response http pipes.
- started servers needs to be closed to avoid Deno resouces leaks errors [for integration tests].
- Deno test runner use parallel workers [# of cpus] with *--parallel* option.
- Deno test runner use one thread for each test file. Starting servers with the same ports on different testing files will cause errors.
- [usage samples](./serving/servers/starting.test.js).
