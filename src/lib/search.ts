import MiniSearch from "minisearch"

export interface SearchResult {
  route: string
  // route plus #anchor when the match is a specific section
  url: string
  title: string
  // section heading; empty when the match is the page preamble
  section: string
  category: string
  // snippet of body text around the first matched term
  snippet: string
  // matched terms, for highlighting in the snippet
  terms: string[]
}

interface SearchDoc {
  id: string
  route: string
  anchor: string
  title: string
  section: string
  category: string
  keywords: string[]
  body: string
}

const SEARCH_OPTIONS = {
  prefix: true,
  // typo tolerance: "nulifier" still finds Notes & Nullifiers
  fuzzy: 0.2,
  boost: { title: 6, section: 4, keywords: 3 },
}

// keep one page from flooding the dropdown with all of its sections
const MAX_PER_PAGE = 2

// Lazy singleton: the index chunk is only fetched when search is first used,
// keeping it out of the initial page load.
let enginePromise: Promise<{
  mini: MiniSearch<SearchDoc>
  docsById: Map<string, SearchDoc>
}> | null = null

function getEngine() {
  if (!enginePromise) {
    enginePromise = import("../search-docs.json").then((mod) => {
      const docs = mod.default as SearchDoc[]

      const mini = new MiniSearch<SearchDoc>({
        fields: ["title", "section", "keywords", "body"],
        storeFields: ["route", "anchor", "title", "section", "category"],
        extractField: (doc, field) => {
          const value = doc[field as keyof SearchDoc]
          return Array.isArray(value) ? value.join(" ") : (value as string)
        },
      })
      mini.addAll(docs)

      const docsById = new Map(docs.map((doc) => [doc.id, doc]))
      return { mini, docsById }
    })
  }
  return enginePromise
}

const SNIPPET_RADIUS = 60

function buildSnippet(body: string, terms: string[]): string {
  let index = -1
  const lower = body.toLowerCase()

  for (const term of terms) {
    index = lower.indexOf(term.toLowerCase())
    if (index >= 0) {
      break
    }
  }

  if (index < 0) {
    return (
      body.slice(0, SNIPPET_RADIUS * 2) + (body.length > SNIPPET_RADIUS * 2 ? "…" : "")
    )
  }

  const start = Math.max(0, index - SNIPPET_RADIUS)
  const end = Math.min(body.length, index + SNIPPET_RADIUS)

  return (
    (start > 0 ? "…" : "") +
    body.slice(start, end).trim() +
    (end < body.length ? "…" : "")
  )
}

export async function search(query: string): Promise<SearchResult[]> {
  const q = query.trim()
  if (q.length === 0) {
    return []
  }

  const { mini, docsById } = await getEngine()

  const perPage: { [route: string]: number } = {}
  const results: SearchResult[] = []

  for (const result of mini.search(q, SEARCH_OPTIONS)) {
    const route = result.route as string
    const count = perPage[route] ?? 0
    if (count >= MAX_PER_PAGE) {
      continue
    }
    perPage[route] = count + 1

    const doc = docsById.get(result.id as string)
    const anchor = result.anchor as string

    results.push({
      route,
      url: anchor ? `${route}#${anchor}` : route,
      title: result.title as string,
      section: result.section as string,
      category: result.category as string,
      snippet: doc ? buildSnippet(doc.body, result.terms) : "",
      terms: result.terms,
    })
  }

  return results
}
