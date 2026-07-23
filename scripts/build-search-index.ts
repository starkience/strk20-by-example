// Build the client-side search index consumed by src/lib/search.ts.
// Emits src/search-docs.json: one record per page SECTION (split at ##/###
// headings) so results deep-link to /route#anchor. Anchors come from the same
// Slugger as md-to-react.ts, which stamps matching ids on rendered headings.
// Code blocks are kept in the body so API names like createPrivateTransfers
// stay searchable.

import fs from "fs"
import path from "path"
import { parseYaml, splitSections } from "./lib"
import { ROUTES_BY_CATEGORY } from "../src/nav"

const { writeFile } = fs.promises

const PAGES_DIR = path.join(__dirname, "..", "src/pages")
const OUT_PATH = path.join(__dirname, "..", "src/search-docs.json")

interface SearchDoc {
  id: string
  route: string
  anchor: string
  title: string
  // section heading; empty for the page preamble
  section: string
  category: string
  keywords: string[]
  body: string
}

// Strip Markdown syntax down to searchable text. Keeps code content
// (identifiers matter in docs search), drops pure markup.
function toPlainText(md: string): string {
  return (
    md
      // fenced code block markers (keep the code itself)
      .replace(/^\s*(```|~~~)[^\n]*$/gm, " ")
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

async function loadDocs(
  route: string,
  navTitle: string,
  category: string,
): Promise<SearchDoc[]> {
  const parts = route.split("/").filter(Boolean)
  const mdPath = path.join(PAGES_DIR, ...parts, "index.md")

  if (!fs.existsSync(mdPath)) {
    return []
  }

  const { metadata, content } = await parseYaml(mdPath)
  const title = metadata.title || navTitle

  const docs = splitSections(content).map((section) => ({
    id: section.anchor ? `${route}#${section.anchor}` : route,
    route,
    anchor: section.anchor,
    title,
    section: section.heading.replace(/[*_`]/g, "").trim(),
    category,
    // page keywords only on the preamble doc so one keyword hit does not
    // rank every section of the page
    keywords: section.anchor ? [] : metadata.keywords || [],
    body: toPlainText(section.body),
  }))

  // placeholder pages have no body yet - keep them findable by title/keywords
  if (docs.length === 0) {
    docs.push({
      id: route,
      route,
      anchor: "",
      title,
      section: "",
      category,
      keywords: metadata.keywords || [],
      body: toPlainText(metadata.description || ""),
    })
  }

  return docs
}

async function main() {
  const docs: SearchDoc[] = []

  for (const category of ROUTES_BY_CATEGORY) {
    const categoryTitle = (category.title || "Concepts").replace(/\s*\n\s*/g, " ")

    for (const route of category.routes || []) {
      docs.push(...(await loadDocs(route.path, route.title, categoryTitle)))
    }

    for (const group of category.groups || []) {
      for (const route of group.routes) {
        docs.push(...(await loadDocs(route.path, route.title, group.title)))
      }
    }
  }

  await writeFile(OUT_PATH, JSON.stringify(docs))
  const pages = new Set(docs.map((doc) => doc.route)).size
  console.log(`Indexed ${docs.length} sections across ${pages} pages to ${OUT_PATH}`)
}

main()
