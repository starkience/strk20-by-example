// Script to make the site agent/LLM-crawlable.
// The SPA ships content inside a JS bundle, so crawlers fetching a route get an
// empty HTML shell. This emits, into build/:
//   - <route>.md        raw Markdown mirror of every page
//   - llms.txt          llms.txt-style index pointing at the .md mirrors
//   - llms-full.txt     the whole site as one Markdown file
// Vercel serves static files before applying the SPA rewrite, so these URLs
// resolve as plain text in production.

import fs from "fs"
import path from "path"
import mustache from "mustache"
import { parseYaml } from "./lib"
import { ROUTES_BY_CATEGORY } from "../src/nav"

const { writeFile, mkdir, readFile, readdir } = fs.promises

const SITE = "https://strk20-by-example.org"
const PAGES_DIR = path.join(__dirname, "..", "src/pages")
const BUILD_DIR = path.join(__dirname, "..", "build")

const HEADER =
  "> Learn Starknet Privacy (STRK20) with runnable examples - privacy pools, " +
  "notes and nullifiers, viewing keys, the Starknet Wallet API, anonymizer " +
  "contracts, and wallet-builder SDK flows. Every page is available as raw " +
  "Markdown at the .md URLs below; the full site in one file is at " +
  `${SITE}/llms-full.txt.`

interface Entry {
  title: string
  route: string
  description: string
  body: string
}

interface Section {
  title: string
  entries: Entry[]
}

// Load the sibling .cairo sources for a page, keyed by basename - the same
// map md-to-react.ts builds. Without this the {{{ContractName}}} placeholders
// survive into the .md mirrors and agents get pages with no contract source.
async function loadCodes(dir: string): Promise<Record<string, string>> {
  const codes: Record<string, string> = {}
  if (!fs.existsSync(dir)) {
    return codes
  }
  for (const file of await readdir(dir)) {
    if (file.endsWith(".cairo")) {
      codes[file.replace(/\.cairo$/, "")] = (await readFile(path.join(dir, file))).toString()
    }
  }
  return codes
}

async function loadEntry(route: string, navTitle: string): Promise<Entry | null> {
  const parts = route.split("/").filter(Boolean)
  const dir = path.join(PAGES_DIR, ...parts)
  const mdPath = path.join(dir, "index.md")

  if (!fs.existsSync(mdPath)) {
    return null
  }

  const { metadata, content } = await parseYaml(mdPath)
  const codes = await loadCodes(dir)

  // Fail loudly rather than letting Mustache render an unknown key as "",
  // which would silently drop a contract from the agent-facing output.
  // Note: scripts/tsconfig.json sets lib ES2015, so no String.matchAll here.
  const placeholder = /\{\{\{(\w+)\}\}\}/g
  let match: RegExpExecArray | null
  while ((match = placeholder.exec(content)) !== null) {
    const name = match[1]
    if (!(name in codes)) {
      throw new Error(
        `build-llms: ${route} references {{{${name}}}} but ${name}.cairo is not in ${dir}`,
      )
    }
  }

  return {
    title: metadata.title || navTitle,
    route,
    description: metadata.description,
    body: mustache.render(content, codes).trim(),
  }
}

async function collectSections(): Promise<Section[]> {
  const sections: Section[] = []

  for (const category of ROUTES_BY_CATEGORY) {
    const title = (category.title || "Concepts").replace(/\s*\n\s*/g, " ")
    const entries: Entry[] = []

    for (const route of category.routes || []) {
      const entry = await loadEntry(route.path, route.title)
      if (entry) {
        entries.push(entry)
      }
    }

    for (const group of category.groups || []) {
      for (const route of group.routes) {
        const entry = await loadEntry(route.path, route.title)
        if (entry) {
          entries.push(entry)
        }
      }
    }

    if (entries.length > 0) {
      sections.push({ title, entries })
    }
  }

  return sections
}

async function main() {
  const sections = await collectSections()

  // Per-page markdown mirrors
  for (const section of sections) {
    for (const entry of section.entries) {
      const parts = entry.route.split("/").filter(Boolean)
      const outPath = path.join(BUILD_DIR, ...parts) + ".md"

      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(
        outPath,
        `# ${entry.title}\n\n> ${entry.description}\n\n${entry.body}\n`,
      )
      console.log(outPath)
    }
  }

  // llms.txt index
  const index = ["# STRK20 by Example", "", HEADER, ""]
  for (const section of sections) {
    index.push(`## ${section.title}`, "")
    for (const entry of section.entries) {
      index.push(`- [${entry.title}](${SITE}${entry.route}.md) - ${entry.description}`)
    }
    index.push("")
  }
  await writeFile(path.join(BUILD_DIR, "llms.txt"), index.join("\n"))

  // llms-full.txt - the whole site in one file
  const full = ["# STRK20 by Example - full site content", "", HEADER, ""]
  for (const section of sections) {
    for (const entry of section.entries) {
      full.push(
        "---",
        "",
        `# ${entry.title}`,
        "",
        `Source: ${SITE}${entry.route}`,
        "",
        `> ${entry.description}`,
        "",
        entry.body,
        "",
      )
    }
  }
  await writeFile(path.join(BUILD_DIR, "llms-full.txt"), full.join("\n"))

  console.log("llms.txt + llms-full.txt written")
}

main()
