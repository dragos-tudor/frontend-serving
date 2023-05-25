import { bundle } from "/emit.ts"

const indexUrl = new URL("./mod.js", import.meta.url)
const bundleOptions = { compilerOptions: { sourceMap: false } }
const bundleResult = await bundle(indexUrl, bundleOptions)

const { code } = bundleResult
const lintNoUsedVars = "// deno-lint-ignore-file no-unused-vars\n"
Deno.writeTextFileSync("./index.js", lintNoUsedVars + code)