// Build-output verifier. Runs after prerender + llms generation and fails the
// build on defects that are invisible in local dev but break real consumers:
//   1. protocol-relative internal hrefs (//route resolves to an external host)
//   2. unrendered {{{Mustache}}} placeholders in the agent-facing .md mirrors
//   3. internal links pointing at routes/files that were never built
import fs from "fs"
import path from "path"
import { getFiles } from "./lib"

const BUILD_DIR = path.join(__dirname, "..", "build")
const SITE = "https://strk20-by-example.org"
const errors: string[] = []

function rel(file: string): string {
  return path.relative(BUILD_DIR, file)
}

// Resolve an href to a site-relative path if it points at this site, or null
// if it is off-site, an in-page anchor, or a non-http scheme - those we never
// resolve against the filesystem.
//
// The prerenderer stamps every canonical, og:url, and rel="alternate" link as
// an absolute `https://strk20-by-example.org/...` URL, not a root-relative
// one. Treating those as "external" (matching `^(https?:)?//`) left the
// site's own self-links entirely unchecked - which is how a dead
// rel="alternate" shipped through a green verify. Both forms are internal.
function internalPath(href: string): string | null {
  if (/^(#|mailto:|tel:)/.test(href)) return null
  if (href === SITE) return "/"
  if (href.startsWith(`${SITE}/`)) return href.slice(SITE.length)
  if (/^(https?:)?\/\//.test(href)) return null
  if (href.startsWith("/")) return href
  return null
}

async function checkProtocolRelativeHrefs(htmlFiles: string[]) {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file).toString()
    for (const match of html.match(/href="\/\/[^"]*"/g) ?? []) {
      errors.push(
        `${rel(file)}: protocol-relative ${match} - the browser resolves this to an external host, not this site`,
      )
    }
  }
}

async function checkNoPlaceholders() {
  // Includes the bundled search index: it embeds page Markdown, so an
  // unsubstituted placeholder lands there too and makes contract source
  // unsearchable.
  const assetsDir = path.join(BUILD_DIR, "assets")
  const textFiles = [
    ...(await getFiles(BUILD_DIR, /\.md$/)),
    // getFiles() has no existence guard (see scripts/lib.ts) - build/assets/
    // should always exist post-vite-build, but guard it anyway so a missing
    // directory here fails with the error list below, not an unhandled
    // rejection.
    ...(fs.existsSync(assetsDir) ? await getFiles(assetsDir, /\.js$/) : []),
    path.join(BUILD_DIR, "llms.txt"),
    path.join(BUILD_DIR, "llms-full.txt"),
  ]
  for (const file of textFiles) {
    if (!fs.existsSync(file)) continue
    const body = fs.readFileSync(file).toString()
    for (const match of body.match(/\{\{\{[^}]+\}\}\}/g) ?? []) {
      errors.push(`${rel(file)}: unrendered placeholder ${match} - contract source is missing`)
    }
  }
}

// A built route lives at build/<route>/index.html; static assets are plain files.
// Must test for a FILE, not mere existence: build/sdk/ is a directory with no
// index.html of its own, so an existsSync check would call /sdk resolved when
// it 404s in production.
function isFile(p: string): boolean {
  return fs.existsSync(p) && fs.statSync(p).isFile()
}

function resolves(href: string): boolean {
  const clean = href.split("#")[0].split("?")[0]
  if (clean === "" || clean === "/") return true
  const target = path.join(BUILD_DIR, clean)
  return (
    isFile(target) || isFile(path.join(target, "index.html")) || isFile(`${target}.html`)
  )
}

async function checkInternalLinks(htmlFiles: string[]) {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file).toString()
    for (const match of html.match(/href="([^"]+)"/g) ?? []) {
      const href = match.slice(6, -1)
      const target = internalPath(href)
      if (target === null) continue
      if (!resolves(target)) {
        errors.push(`${rel(file)}: dead internal link ${href}`)
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error("verify: build/ does not exist - run npm run build first")
    process.exit(1)
  }
  const htmlFiles = await getFiles(BUILD_DIR, /\.html$/)

  await checkProtocolRelativeHrefs(htmlFiles)
  await checkNoPlaceholders()
  await checkInternalLinks(htmlFiles)

  if (errors.length > 0) {
    console.error(`verify: ${errors.length} problem(s) found\n`)
    for (const error of errors) console.error(`  ${error}`)
    process.exit(1)
  }
  console.log(`verify: OK (${htmlFiles.length} html files checked)`)
}

main().catch((error) => {
  console.error(`verify: crashed - ${error instanceof Error ? error.stack : error}`)
  process.exit(1)
})
