import assert from "assert"
import fs from "fs"
import path from "path"
import yaml from "yaml"
import mustache from "mustache"
const { readdir, stat, access, readFile, writeFile } = fs.promises

export async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch (error) {
    return false
  }
}

export async function copy(fromFilePath: string, toFilePath: string) {
  const file = await readFile(fromFilePath)
  await fs.promises.mkdir(path.dirname(toFilePath), { recursive: true })
  await writeFile(toFilePath, file)
}

export function removeExt(file: string | undefined): string {
  if (!file) {
    throw new Error(`Failed to remove extension. Invalid file name`)
  }

  return file.split(".").slice(0, -1).join("")
}

export function getExt(file: string | undefined): string {
  if (!file) {
    throw new Error(`Failed to get extension. Invalid file name`)
  }

  const ext = file.split(".").slice(-1)[0]

  if (!ext) {
    throw new Error(`Failed to get file extension.`)
  }

  return ext
}

export async function renderTemplateToFile(
  templatePath: string,
  writeToPath: string,
  data: {},
): Promise<void> {
  const template = (await readFile(templatePath)).toString()
  const content = mustache.render(template, data)
  await writeFile(writeToPath, content)

  console.log(`Created ${writeToPath}`)
}

export async function getFiles(root: string, reg_exp: RegExp): Promise<string[]> {
  // traverse
  const queue = [root]

  const files: string[] = []
  while (true) {
    const dir = queue.pop()

    if (!dir) {
      break
    }

    const dirs = await readdir(dir)

    for (const file_name of dirs) {
      const file_path = path.join(dir, file_name)
      const file_stat = await stat(file_path)

      if (file_stat.isDirectory()) {
        queue.push(file_path)
      } else if (reg_exp.test(file_name)) {
        files.push(file_path)
      }
    }
  }

  return files
}

// yaml
export interface Metadata {
  title: string
  description: string
  version: string
  keywords: string[]
  githubLink?: string
  githubLabel?: string
}

function findIndexOfFrontMatter(lines: string[]): number {
  assert(lines[0] === "---", "Front matter missing")

  // find front matter
  let i = 1
  while (i < lines.length && lines[i] !== "---") {
    i++
  }

  return i
}

function getMetadata(lines: string[]): Metadata {
  assert(lines[0] === "---", "Invalid front matter")
  assert(lines[lines.length - 1] === "---", "Invalid front matter")

  const {
    title,
    description,
    version,
    keywords,
    githubLink = "",
    githubLabel = "",
  } = yaml.parse(lines.slice(1, -1).join("\n"))

  return { title, description, version, keywords, githubLink, githubLabel }
}

export async function parseYaml(filePath: string): Promise<{
  content: string
  metadata: Metadata
}> {
  const md = (await readFile(filePath)).toString()
  const lines = md.split("\n")

  const i = findIndexOfFrontMatter(lines)

  const metadata = getMetadata(lines.slice(0, i + 1))
  const content = lines.slice(i + 1).join("\n")

  return {
    metadata,
    content,
  }
}

// routes
// Build route from index.tsx or index.md file path
export function buildRoute(folders: string[]) {
  const route = ["/"]

  // ignore path up to /pages
  const start = folders.findIndex((file) => file === "pages")
  assert(start > 0, `Cannot find pages folder`)

  for (let i = start + 1; i < folders.length; i++) {
    const file = folders[i]

    // ignore index.tsx and index.md
    if (file == "index.tsx" || file == "index.md") {
      continue
    }

    route.push(file)
  }

  return path.join(...route)
}

// headings & anchors
// GitHub-style slug for a heading. Both the page renderer (md-to-react) and
// the search index builder (build-search-index) MUST use this so search
// anchors match the ids on the rendered pages.
export function slugify(heading: string): string {
  return (
    heading
      // strip markdown emphasis, inline-code ticks and link syntax
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
  )
}

// Per-page slug dedupe: "install", "install-1", ...
export class Slugger {
  private seen: { [slug: string]: number } = {}

  slug(heading: string): string {
    const base = slugify(heading)
    const count = this.seen[base] ?? 0
    this.seen[base] = count + 1
    return count === 0 ? base : `${base}-${count}`
  }
}

export interface MdSection {
  // empty for the preamble before the first heading
  heading: string
  anchor: string
  depth: number
  body: string
}

// Split markdown into sections at ## / ### headings, ignoring heading-like
// lines inside fenced code blocks. Deeper headings stay in their section.
export function splitSections(md: string): MdSection[] {
  const slugger = new Slugger()
  const sections: MdSection[] = [{ heading: "", anchor: "", depth: 0, body: "" }]

  let inFence = false
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
    }

    const m = !inFence && line.match(/^(#{1,6})\s+(.*)/)
    if (m) {
      // every heading consumes a slug so ids stay in sync with the renderer,
      // but only depth 2-3 starts a new section
      const anchor = slugger.slug(m[2])
      if (m[1].length <= 3) {
        sections.push({ heading: m[2], anchor, depth: m[1].length, body: "" })
        continue
      }
    }

    sections[sections.length - 1].body += line + "\n"
  }

  return sections.filter((s) => s.heading !== "" || s.body.trim().length > 0)
}
