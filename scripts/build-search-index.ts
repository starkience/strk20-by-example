// Build the client-side search index consumed by src/lib/search.ts.
// Emits src/search-docs.json: one record per page with the fields MiniSearch
// indexes at runtime (title, headings, keywords, body). Code blocks are kept
// in the body so API names like createPrivateTransfers stay searchable.

import fs from "fs"
import path from "path"
import { parseYaml } from "./lib"
import { ROUTES_BY_CATEGORY } from "../src/nav"

const { writeFile } = fs.promises

const PAGES_DIR = path.join(__dirname, "..", "src/pages")
const OUT_PATH = path.join(__dirname, "..", "src/search-docs.json")

interface SearchDoc {
  route: string
  title: string
  category: string
  keywords: string[]
  headings: string
  body: string
}

// Strip Markdown syntax down to searchable text. Keeps code content
// (identifiers matter in docs search), drops pure markup.
function toPlainText(md: string): string {
  return (
    md
      // fenced code block markers (keep the code itself)
      .replace(/^```[^\n]*$/gm, " ")
      // images, then links: keep the label, drop the URL
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // html tags
      .replace(/<[^>]+>/g, " ")
      // heading markers, emphasis, inline-code ticks, table pipes
      .replace(/^#{1,6}\s+/gm, " ")
      .replace(/[*_`|]/g, " ")
      // collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  )
}

function extractHeadings(md: string): string {
  const headings: string[] = []
  for (const line of md.split("\n")) {
    const m = line.match(/^#{1,6}\s+(.*)/)
    if (m) {
      headings.push(m[1].replace(/[*_`]/g, "").trim())
    }
  }
  return headings.join(" ")
}

async function loadDoc(
  route: string,
  navTitle: string,
  category: string,
): Promise<SearchDoc | null> {
  const parts = route.split("/").filter(Boolean)
  const mdPath = path.join(PAGES_DIR, ...parts, "index.md")

  if (!fs.existsSync(mdPath)) {
    return null
  }

  const { metadata, content } = await parseYaml(mdPath)

  return {
    route,
    title: metadata.title || navTitle,
    category,
    keywords: metadata.keywords || [],
    headings: extractHeadings(content),
    body: toPlainText(content),
  }
}

async function main() {
  const docs: SearchDoc[] = []

  for (const category of ROUTES_BY_CATEGORY) {
    const categoryTitle = (category.title || "Concepts").replace(/\s*\n\s*/g, " ")

    for (const route of category.routes || []) {
      const doc = await loadDoc(route.path, route.title, categoryTitle)
      if (doc) {
        docs.push(doc)
      }
    }

    for (const group of category.groups || []) {
      for (const route of group.routes) {
        const doc = await loadDoc(route.path, route.title, group.title)
        if (doc) {
          docs.push(doc)
        }
      }
    }
  }

  await writeFile(OUT_PATH, JSON.stringify(docs))
  console.log(`Indexed ${docs.length} pages to ${OUT_PATH}`)
}

main()
