import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const docs = join(root, "docs")

if (!existsSync(join(docs, "index.html"))) {
  throw new Error("docs/index.html is missing. Run vite build first.")
}

writeFileSync(join(docs, ".nojekyll"), "")
writeFileSync(join(root, ".nojekyll"), "")
cpSync(join(docs, "index.html"), join(root, "index.html"))

const assetsSrc = join(docs, "assets")
const assetsDest = join(root, "assets")
if (existsSync(assetsDest)) {
  rmSync(assetsDest, { recursive: true, force: true })
}
if (existsSync(assetsSrc)) {
  cpSync(assetsSrc, assetsDest, { recursive: true })
}

for (const name of readdirSync(docs)) {
  if (name === "index.html" || name === "assets" || name === ".nojekyll") {
    continue
  }
  cpSync(join(docs, name), join(root, name), { recursive: true })
}

console.log("Published GitHub Pages files to docs/ and repo root.")
