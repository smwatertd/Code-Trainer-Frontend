import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = join(__dirname, "../openapi/openapi.json")
const baseUrl = process.env.OPENAPI_URL ?? "http://localhost:8000/api/openapi.json"

const response = await fetch(baseUrl)
if (!response.ok) {
  throw new Error(`Failed to fetch OpenAPI: ${response.status} ${response.statusText}`)
}

const json = await response.text()
writeFileSync(outPath, json.endsWith("\n") ? json : `${json}\n`, "utf8")
console.log(`Wrote ${outPath}`)
