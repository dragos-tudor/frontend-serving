// deno-lint-ignore-file no-unused-vars
const { dirname , extname  } = await import("https://cdn.deno.land/std/versions/0.189.0/raw/path/mod.ts");
const { red , green  } = await import("https://cdn.deno.land/std/versions/0.189.0/raw/fmt/colors.ts");
const { exists  } = await import("https://cdn.deno.land/std/versions/0.189.0/raw/fs/exists.ts");
const { serve , serveTls  } = await import("https://deno.land/std@0.189.0/http/server.ts");
const { sassCompiler , tsCompiler  } = await import("https://raw.githubusercontent.com/dragos-tudor/frontend-building/v0.1.0/index.js");
const CONTENT_LENGTH = "content-length";
const CONTENT_TYPE = "content-type";
const HTML_EXT = ".html";
const MediaTypes = {
    ".md": "text/markdown",
    ".html": "text/html",
    ".htm": "text/html",
    ".json": "application/json",
    ".map": "application/json",
    ".js": "application/javascript",
    ".jsx": "application/javascript",
    ".ts": "application/javascript",
    ".tsx": "application/javascript",
    ".css": "text/css",
    ".scss": "text/css",
    ".sass": "text/css",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ico": "image/x-icon"
};
const BAD_REQUEST = "Bad Request";
const createBadRequestResponse = ()=>new Response(BAD_REQUEST, {
        headers: new Headers({
            [CONTENT_LENGTH]: BAD_REQUEST.length,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 400
    });
const FORBIDDEN = "forbidden";
const createForbiddenResponse = ()=>new Response(FORBIDDEN, {
        headers: new Headers({
            [CONTENT_LENGTH]: FORBIDDEN.length,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 403
    });
const createNoContentResponse = ()=>new Response(null, {
        headers: new Headers({
            [CONTENT_LENGTH]: 0,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 204
    });
const NOT_FOUND = "Not Found";
const createNotFoundResponse = ()=>new Response(NOT_FOUND, {
        headers: new Headers({
            [CONTENT_LENGTH]: NOT_FOUND.length,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 404
    });
const createNotModifiedResponse = ()=>new Response(null, {
        headers: new Headers({
            [CONTENT_LENGTH]: 0,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 304
    });
const createOkResponse = (body, headers)=>new Response(body, {
        headers,
        status: 200
    });
const SERVER_ERROR = "Internal server error";
const SERVER_ERROR_HEADER = "X-Server-Error";
const getServerMessage = (message)=>message ?? SERVER_ERROR;
const createServerErrorResponse = (message)=>new Response(getServerMessage(message), {
        headers: new Headers({
            [CONTENT_LENGTH]: getServerMessage(message).length,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT],
            [SERVER_ERROR_HEADER]: getServerMessage(message)
        }),
        status: 500
    });
const UNAUTHORIZED = "Unauthorized";
const createUnauthorizedResponse = ()=>new Response(UNAUTHORIZED, {
        headers: new Headers({
            [CONTENT_LENGTH]: UNAUTHORIZED.length,
            [CONTENT_TYPE]: MediaTypes[HTML_EXT]
        }),
        status: 401
    });
const existsBody = (body)=>body != undefined;
const isStringBody = (body)=>typeof body === "string";
const toJsonBody = (body)=>isStringBody(body) && body || existsBody(body) && JSON.stringify(body) || null;
const createResponse = (body, contentType, statusCode = 200)=>new Response(body, {
        headers: new Headers({
            [CONTENT_LENGTH]: (body?.length ?? 0).toString(),
            [CONTENT_TYPE]: contentType
        }),
        status: statusCode
    });
const createJsonResponse = (body, statusCode = 200)=>createResponse(toJsonBody(body), MediaTypes[".json"], statusCode);
export { createBadRequestResponse as createBadRequestResponse };
export { createForbiddenResponse as createForbiddenResponse };
export { createNoContentResponse as createNoContentResponse };
export { createNotFoundResponse as createNotFoundResponse };
export { createNotModifiedResponse as createNotModifiedResponse };
export { createOkResponse as createOkResponse };
export { createServerErrorResponse as createServerErrorResponse };
export { createUnauthorizedResponse as createUnauthorizedResponse };
export { createJsonResponse as createJsonResponse, createResponse as createResponse };
export { MediaTypes as MediaTypes };
const chainMiddlewares = (middlewares, lastMiddleware = createNotFoundResponse)=>Array.from(middlewares).reverse().reduce((acc, middleware)=>middleware(acc), lastMiddleware);
const RootPath = "/";
const isRootPath = (request)=>new URL(request.url).pathname === RootPath;
const RootHtml = "/index.html";
const getUrlPathName = (url)=>new URL(url).pathname;
const getUrlSearch = (url)=>new URL(url).search;
const getUrlPath = (request)=>isRootPath(request) ? RootHtml : getUrlPathName(request.url);
const getUrlSearchParams = (request)=>getUrlSearch(request.url);
const setSearchParam = (obj, param)=>{
    const [name, value] = decodeURIComponent(param).split("=");
    return Object.assign(obj, {
        [name]: value
    });
};
const toSearchParams = (request)=>getUrlSearchParams(request).replace("?", "").split("&").reduce(setSearchParam, {});
const getTimeNow = ()=>new Date(Date.now()).toISOString();
const logInfo = (enabled, ...args)=>enabled && console.info(green("[serving]"), getTimeNow(), ...args);
const logError = (enabled, error)=>enabled && console.error(red("[serving]"), getTimeNow(), error);
const toHexString = (__byte)=>__byte.toString(16).padStart(2, "00");
const getEncodedTag = (lastModified, size)=>{
    const jsonLastModified = new Date(lastModified).toJSON();
    const rawEtag = `${jsonLastModified}${size}`;
    const encodedEtag = new TextEncoder().encode(rawEtag);
    return encodedEtag;
};
const getHexStringTag = async (encodedEtag)=>{
    const hashType = "SHA-1";
    const hashBuffer = await crypto.subtle.digest(hashType, encodedEtag);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(toHexString).join("");
};
const getFileEtag = async (lastModified, size)=>{
    const encodedRawEtag = getEncodedTag(lastModified, size);
    return await getHexStringTag(encodedRawEtag);
};
const getFileInfo = (cwd, url)=>Deno.stat(`${cwd}${url}`);
const existsLastModifiedDate = (lastModified)=>lastModified instanceof Date;
const getIfNoneMatchHeader = (headers)=>headers.get("If-None-Match");
const setETagHeader = (headers, etag)=>headers.set("ETag", etag);
const existsFile = (filePath)=>exists(filePath);
const isGzipFile = (fileContent)=>fileContent[0] === 0x1F && fileContent[1] === 0x8B;
const setHeaderContentLength = (headers, fileContent)=>headers.set("content-length", fileContent.length.toString());
const setHeaderContentType = (headers, mediaType)=>headers.set("content-type", mediaType || "application/octet-stream");
const setHeaderContentEncoding = (headers, encoding)=>headers.set("content-encoding", encoding);
const getFileHeaders = (fileContent, fileExtension)=>{
    const headers = new Headers();
    const mediaType = MediaTypes[fileExtension];
    setHeaderContentLength(headers, fileContent);
    setHeaderContentType(headers, mediaType);
    if (isGzipFile(fileContent)) setHeaderContentEncoding(headers, "gzip");
    return headers;
};
const getFileExtension = (fileName)=>extname(fileName);
const getFilePath = (cwd, url)=>`${cwd}${url}`;
const existsFileCompiler = (compiler, fileExtension)=>compiler.extensions?.includes(fileExtension);
const findFileCompiler = (compilers, filePath)=>compilers.find((compiler)=>existsFileCompiler(compiler, getFileExtension(filePath)));
const isRootFileRequest = (request)=>getUrlPath(request) === "/";
const isFileRequest = (request)=>isRootFileRequest(request) || !!extname(getUrlPath(request));
const createFileResponse = (fileContent, fileExtension)=>fileContent.length ? createOkResponse(fileContent, getFileHeaders(fileContent, fileExtension)) : createNoContentResponse();
const filesMiddleware = (compilers = [])=>(next)=>async (request, context = {})=>{
            const { cwd , logEnabled  } = context;
            if (isFileRequest(request) === false) return next(request, context);
            const filePath = getFilePath(cwd, getUrlPath(request));
            if (!await existsFile(filePath)) return createNotFoundResponse();
            const compiler = findFileCompiler(compilers, filePath);
            const fileContent = await (compiler?.compileFile || Deno.readFile)(filePath);
            logInfo(logEnabled, "files middleware:", getUrlPath(request));
            return createFileResponse(fileContent, getFileExtension(filePath));
        };
const isGetRequest = (request)=>request.method.toUpperCase() === "GET";
const isFileCacheRequest = (request)=>isFileRequest(request) && isGetRequest(request);
const removeETagWeakValidator = (etag)=>etag?.replace("/W", "");
const isFileModified = (fileETag, ifNoneMatchHeader)=>removeETagWeakValidator(fileETag) !== removeETagWeakValidator(ifNoneMatchHeader);
const cacheMiddleware = (next)=>async (request, context = {})=>{
        const { cwd , logEnabled  } = context;
        if (!isFileCacheRequest(request)) return next(request, context);
        const fileInfo = await getFileInfo(cwd, getUrlPath(request));
        if (!existsLastModifiedDate(fileInfo.mtime)) return next(request.context);
        const fileEtag = await getFileEtag(fileInfo.mtime, fileInfo.size);
        const ifNoneMatchHeader = getIfNoneMatchHeader(request.headers);
        const fileModified = isFileModified(fileEtag, ifNoneMatchHeader);
        if (!fileModified) logInfo(logEnabled, "cache middleware:", getUrlPath(request));
        if (!fileModified) return createNotModifiedResponse();
        const response = await next(request, context);
        setETagHeader(response.headers, fileEtag);
        return response;
    };
const getErrorType = (error)=>error instanceof URIError && "badRequest" || error instanceof Deno.errors.NotFound && "notFound";
const createErrorResponse = Object.freeze({
    "badRequest": createBadRequestResponse,
    "notFound": createNotFoundResponse,
    "serverError": createServerErrorResponse
});
const SERVER_ERROR_HEADER1 = "X-Server-Error";
const errorsMiddleware = (next)=>async (request, context = {})=>{
        const { logEnabled  } = context;
        try {
            const response = await next(request, context);
            if (response.status === 500) logError(logEnabled, response.headers.get(SERVER_ERROR_HEADER1));
            return response;
        } catch (error) {
            logError(logEnabled, error);
            const errorType = getErrorType(error) || "serverError";
            return createErrorResponse[errorType](error.message);
        }
    };
const evalCode = async (request)=>{
    const evalJsx = await request.text();
    const evalOptions = {
        args: [
            "eval",
            "--ext=jsx",
            evalJsx
        ]
    };
    const execPath = Deno.execPath();
    const command = new Deno.Command(execPath, evalOptions);
    const { code , stdout , stderr  } = await command.output();
    const content = code === 0 ? new TextDecoder().decode(stdout) : new TextDecoder().decode(stderr);
    return code === 0 ? createOkResponse(content, getFileHeaders(content, ".html")) : createServerErrorResponse(content);
};
const isEvalRequest = (request)=>getUrlPath(request).endsWith("/eval");
const isEvalCodeRequest = (request)=>isEvalRequest(request) && getUrlSearchParams(request) === "";
const evalScript = async (document, fetch)=>{
    const sourceElem = document.querySelector("source");
    const targetElem = document.querySelector("target");
    const request = {
        body: sourceElem.innerText,
        method: "POST"
    };
    const response = await fetch("/eval", request);
    const ssrHtml = await response.text();
    targetElem.innerHTML = ssrHtml;
};
const getEvalScript = (source = "script[nomodule]", target = "main")=>evalScript.toString().split("=>")[1].replace('"source"', `"${source}"`).replace('"target"', `"${target}"`);
const evalMiddleware = (next)=>(request, context = {})=>{
        if (!isEvalRequest(request)) return next(request, context);
        if (isEvalCodeRequest(request)) return evalCode(request);
        const params = toSearchParams(request);
        const evalScript = getEvalScript(params.source, params.target);
        return createOkResponse(evalScript, getFileHeaders(evalScript, ".js"));
    };
const CONTENT_LENGTH1 = "content-length";
const setContentLengthHeader = (headers, length)=>headers.set(CONTENT_LENGTH1, length);
const changeLocation = (location)=>(msg)=>{
        if (msg.name !== "reload") return location;
        if (location.pathname === "/") {
            location.href = `${location.origin}${location.search}`;
            return location;
        }
        const search = location.search.replace("?", "&");
        const reloadUrl = encodeURIComponent(location.pathname);
        const reloadFile = encodeURIComponent(msg.payload);
        location.href = `${location.origin}?reloadUrl=${reloadUrl}${search}&reloadFile=${reloadFile}`;
        return location;
    };
const connectWebSocket = (location, logger)=>{
    const wsUrl = location.origin.replace("http", "ws");
    const wsClient = new WebSocket(wsUrl + "/watch");
    wsClient.onopen = ()=>logger.info("[serving]", "websocket is open");
    wsClient.onclose = ()=>logger.info("[serving]", "websocket is closed");
    wsClient.onerror = (ex)=>logger.error("[serving]", "websocket error: ", ex);
    wsClient.onmessage = (msg)=>changeLocation(location)(JSON.parse(msg.data));
    wsClient.beforeunload = ()=>wsClient.close();
    return wsClient;
};
const isOpenWebSocket = (socket)=>socket.readyState === WebSocket.OPEN;
const sendWebSocketEvent = (socket, name, payload)=>isOpenWebSocket(socket) && socket.send(JSON.stringify({
        name,
        payload
    }));
const upgradeWebSocket = (request, resource, context = {})=>{
    const { socket , response  } = Deno.upgradeWebSocket(request);
    const { logEnabled  } = context;
    socket.onopen = ()=>logInfo(logEnabled, "websocket has been open.");
    socket.onclose = ()=>{
        resource?.close();
        logInfo(logEnabled, "websocket has been closed.");
    };
    socket.onerror = (error)=>{
        logError(logEnabled, error);
    };
    return {
        socket,
        response
    };
};
const ReloadScript = `
  <!-- injected by hmr middlware -->
  <script type="text/javascript">
    const ${changeLocation.name} = ${changeLocation.toString()}
    const ${connectWebSocket.name} = ${connectWebSocket.toString()};
    ${connectWebSocket.name}(location, console)
  </script>
`;
const injectReloadScript = async (response)=>{
    const html = new TextDecoder().decode(await response.arrayBuffer());
    const reloadHtml = html.replace("<body>", "<body>" + ReloadScript);
    return new TextEncoder().encode(reloadHtml);
};
const createIndexFileResponse = async (next, request, context)=>{
    const fileResponse = await next(request, context);
    const reloadHtml = await injectReloadScript(fileResponse);
    setContentLengthHeader(fileResponse.headers, reloadHtml.length);
    return createOkResponse(reloadHtml, fileResponse.headers);
};
const RootHtmls = [
    "/",
    "/index.html",
    "/index.htm"
];
const isRootFileRequest1 = (request)=>RootHtmls.includes(getUrlPath(request));
const isWatchRequest = (request)=>getUrlPath(request).endsWith("/watch");
const isModifiedFileEvent = (event)=>event.kind === "modify";
const watchFiles = async (watcher, func)=>{
    for await (const event of watcher){
        if (isModifiedFileEvent(event)) func(event.paths);
    }
};
const debounceExec = (func, delay = 300)=>{
    let timeoutId = 0;
    return (...args)=>{
        clearTimeout(timeoutId);
        timeoutId = setTimeout(()=>{
            clearTimeout(timeoutId);
            func(...args);
        }, delay);
    };
};
const sendReloadMessage = (socket, cwd)=>debounceExec((paths)=>sendWebSocketEvent(socket, "reload", paths[0].replace(cwd, "")), 300);
const upgradeWatchFilesSocket = (request, context)=>{
    const { cwd  } = context;
    const watcher = Deno.watchFs(cwd);
    const { socket , response  } = upgradeWebSocket(request, watcher, context);
    watchFiles(watcher, sendReloadMessage(socket, cwd));
    return response;
};
const hmrMiddleware = (next)=>(request, context = {})=>isRootFileRequest1(request) && createIndexFileResponse(next, request, context) || isWatchRequest(request) && upgradeWatchFilesSocket(request, context) || next(request, context);
const ContextOptions = {
    cwd: Deno.cwd(),
    logEnabled: false
};
const ServerOptions = {
    hostname: "localhost",
    port: 8080,
    context: ContextOptions
};
const addAbortSignalOptions = (options, abortCtrl)=>Object.assign(options, {
        signal: abortCtrl.signal,
        onListen: ()=>{}
    });
const addAlpnProtocolsOptions = (options)=>Object.assign(options, {
        alpnProtocols: [
            "h2",
            "http/1.1"
        ]
    });
const ensureDefaultOptions = (defaults, options)=>Object.assign(defaults, options);
const isTlsServer = (options)=>"certFile" in options || "cert" in options;
const startServer = (requestHandler, options = ServerOptions)=>{
    const serverOptions = ensureDefaultOptions(ServerOptions, options);
    const contextOptions = ensureDefaultOptions(ContextOptions, options.context);
    const startMessage = `${isTlsServer(options) ? "https" : "http"}://${options.hostname}:${options.port}`;
    logInfo(true, "server address", startMessage);
    logInfo(true, "current working directory", contextOptions.cwd);
    const abortCtrl = new AbortController();
    addAbortSignalOptions(serverOptions, abortCtrl);
    isTlsServer(options) ? serveTls((request)=>requestHandler(request, contextOptions), addAlpnProtocolsOptions(serverOptions)) : serve((request)=>requestHandler(request, contextOptions), serverOptions);
    return {
        close: ()=>abortCtrl.abort()
    };
};
export { startServer as startServer };
const filesRequestHandler = chainMiddlewares([
    errorsMiddleware,
    cacheMiddleware,
    filesMiddleware([
        sassCompiler,
        tsCompiler
    ])
]);
const hmrRequestHandler = chainMiddlewares([
    errorsMiddleware,
    evalMiddleware,
    cacheMiddleware,
    hmrMiddleware,
    filesMiddleware([
        sassCompiler,
        tsCompiler
    ])
]);
const startFileServer = (options)=>startServer(filesRequestHandler, options);
const startHmrServer = (options)=>startServer(hmrRequestHandler, options);
export { cacheMiddleware as cacheMiddleware };
export { errorsMiddleware as errorsMiddleware };
export { filesMiddleware as filesMiddleware };
export { hmrMiddleware as hmrMiddleware };
export { startFileServer as startFileServer };
export { startHmrServer as startHmrServer };
