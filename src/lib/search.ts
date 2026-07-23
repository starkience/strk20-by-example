import MiniSearch from "minisearch"

export interface SearchResult {
  route: string
  title: string
  category: string
  // snippet of body text around the first matched term
  snippet: string
  // matched terms, for highlighting in the snippet
  terms: string[]
}

interface SearchDoc {
  route: string
  title: string
  category: string
  keywords: string[]
  headings: string
  body: string
}

const SEARCH_OPTIONS = {
  prefix: true,
  // typo tolerance: "nulifier" still finds Notes & Nullifiers
  fuzzy: 0.2,
  boost: { title: 6, headings: 3, keywords: 3 },
}

// Lazy singleton: the index chunk is only fetched when search is first used,
// keeping it out of the initial page load.
let enginePromise: Promise<{
  mini: MiniSearch<SearchDoc>
  docsByRoute: Map<string, SearchDoc>
}> | null = null

function getEngine() {
  if (!enginePromise) {
    enginePromise = import("../search-docs.json").then((mod) => {
      const docs = mod.default as SearchDoc[]

      const mini = new MiniSearch<SearchDoc>({
        idField: "route",
        fields: ["title", "headings", "keywords", "body"],
        storeFields: ["route", "title", "category"],
        extractField: (doc, field) => {
          const value = doc[field as keyof SearchDoc]
          return Array.isArray(value) ? value.join(" ") : (value as string)
        },
      })
      mini.addAll(docs)

      const docsByRoute = new Map(docs.map((doc) => [doc.route, doc]))
      return { mini, docsByRoute }
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

  const { mini, docsByRoute } = await getEngine()

  return mini.search(q, SEARCH_OPTIONS).map((result) => {
    const doc = docsByRoute.get(result.id as string)
    return {
      route: result.id as string,
      title: result.title as string,
      category: result.category as string,
      snippet: doc ? buildSnippet(doc.body, result.terms) : "",
      terms: result.terms,
    }
  })
}
