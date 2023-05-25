## Frontend http server library
- Deno-based backend web development library [Node-free].
- functional-style library [OOP-free].
- single library, mono repo.

### [Serving library](./serving/)
- used as *Hot Module Replacement server* for web development.
- used as *File server* for integration testing.

#### [Files middleware](./middlewares-files/)
- handle file requests.
- use plugin arhitecture to inject compilers:
  - compile/transpile ts files [`.jsx, .ts, .tsx`] to `js` file.
  - compile/transpile sass files [`.sass, .scss`] to `css` file.
- should be used as final middleware.
- could be used as standalone middleware for files server.

#### [Caching middleware](./middlewares-caching/)
- handle file requests sending `304` http response for unmodified files.
- based on specific caching headers.
- use action-pattern matching.
- should be used before files middleware.
- not intent to be used without files middleware.

#### [HMR middleware](./middlewares-hmr/)
- handle *watch* requests accepting client websocket connections.
- based on websocket bidirectional server-client communication.
- watch for files changes sending *reload* command to client.
- handle `index.html` requests injecting reloading script in index files responses.
- should be used before files middleware.
- not intent to be used without files middleware.

#### [Errors middleware](./middlewares-errors/)
- handle and log uncatched errors.
- should be the first middleware.

#### [Evaluating middleware](./middlewares-evaluating/)
- server side js code evaluation.

#### Serving notes
- based on *middlewares architecture* [similar to ASPNET midlewares].
- middlewares are chained to build request/response http pipes.
- started servers should be closed to avoid Deno resouces leaks errors [for integration tests].
- Deno test runner use parallel workers [# of cpus] when run with *--jobs* option.
- Deno test runner use one thread for each test file. Starting servers on the same ports for different testing files should result errors.
- [usage samples](./serving/servers/starting.test.js).

### Credits
- [deno - denoland team](https://github.com/denoland/deno).
- [deno standard libraries - denoland team](https://github.com/denoland/deno_std).
- [deno sass - Nassim Zen](https://github.com/hironichu/denosass).
- [dart sass - sass team](https://github.com/sass/dart-sass).
