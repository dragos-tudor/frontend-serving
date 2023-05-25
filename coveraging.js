import { runCodeCoverage } from "/building.js"

runCodeCoverage(Deno.args[0] || Deno.cwd(), 80)