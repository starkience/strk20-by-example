// Prerender: make every route serve real HTML, not an empty SPA shell.
//
// After `vite build`, build/index.html is a shell whose <div id="root"> is
// empty - crawlers and AI agents fetching any route see nothing. This script
// stamps, for every page under src/pages, a copy of the shell with:
//   - the page's rendered Markdown (the `html` export of index.html.ts)
//     injected into #root, so no-JS consumers get the full content
//   - per-route <title>, meta description, og:/twitter: tags, a canonical
//     link, and a rel="alternate" link to the page's raw-Markdown mirror
// src/index.tsx hydrates over the injected content when JS runs, so browser
// users still get the SPA.
//
// Also emits: build/404.html (pristine shell, gh-pages SPA fallback),
// build/sitemap.xml and build/robots.txt.
//
// Runs from postbuild, replacing the old copy-index step (scripts/build.ts)
// which stamped the *empty* shell into each route.

import fs from "fs"
import path from "path"
import { getFiles } from "./lib"
import { ROUTES_BY_CATEGORY, Route, RouteGroup } from "../src/nav"

const { readFile, writeFile } = fs.promises

const SITE = "https://strk20-by-example.org"
const SITE_TITLE = "STRK20 by Example"
const PAGES_DIR = path.join(__dirname, "..", "src/pages")
const BUILD_DIR = path.join(__dirname, "..", "build")

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// Every replacement asserts it matched - a silent no-op here would quietly
// ship the wrong metadata on every page.
function replaceOnce(html: string, pattern: RegExp, replacement: string, what: string): string {
  if (!pattern.test(html)) {
    throw new Error(`prerender: could not find ${what} in shell`)
  }
  return html.replace(pattern, replacement)
}

interface PageMeta {
  title: string
  description: string
  html: string
}

function loadPage(routeParts: string[]): PageMeta | null {
  const modPath = path.join(PAGES_DIR, ...routeParts, "index.html.ts")
  if (!fs.existsSync(modPath)) {
    return null
  }
  // Pure data modules (strings only) - safe to require from ts-node.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(modPath)
  return { title: mod.title, description: mod.description, html: mod.default }
}

function renderShell(
  shell: string,
  route: string, // "" for the homepage, "sdk/register" otherwise
  meta: { title: string; description: string },
  content: string,
): string {
  const url = route ? `${SITE}/${route}` : `${SITE}/`
  const fullTitle = route ? `${escapeHtml(meta.title)} | ${SITE_TITLE}` : SITE_TITLE
  const desc = escapeHtml(meta.description)

  let out = shell
  out = replaceOnce(out, /<title>[^<]*<\/title>/, `<title>${fullTitle}</title>`, "<title>")
  out = replaceOnce(
    out,
    /(<meta[^>]*name="description"[^>]*content=")[^"]*(")/,
    `$1${desc}$2`,
    "meta description",
  )
  out = replaceOnce(
    out,
    /(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/,
    `$1${fullTitle}$2`,
    "og:title",
  )
  out = replaceOnce(
    out,
    /(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/,
    `$1${desc}$2`,
    "og:description",
  )
  out = replaceOnce(
    out,
    /(<meta[^>]*property="og:url"[^>]*content=")[^"]*(")/,
    `$1${url}$2`,
    "og:url",
  )
  out = replaceOnce(
    out,
    /(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/,
    `$1${fullTitle}$2`,
    "twitter:title",
  )
  out = replaceOnce(
    out,
    /(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/,
    `$1${desc}$2`,
    "twitter:description",
  )

  const extraLinks =
    `<link rel="canonical" href="${url}" />` +
    (route
      ? `<link rel="alternate" type="text/markdown" title="${fullTitle} (Markdown)" href="${SITE}/${route}.md" />`
      : `<link rel="alternate" type="text/plain" title="${SITE_TITLE} (llms.txt)" href="${SITE}/llms.txt" />`)
  out = replaceOnce(out, /<\/head>/, `${extraLinks}</head>`, "</head>")

  out = replaceOnce(
    out,
    /<div id="root"><\/div>/,
    `<div id="root">${content}</div>`,
    'empty <div id="root">',
  )
  return out
}

function pageContent(meta: PageMeta): string {
  return `<main><article><h1>${escapeHtml(meta.title)}</h1>${meta.html}</article></main>`
}

// Homepage: no index.html.ts, so render the nav as a linked table of contents.
function homeContent(): string {
  const sections = ROUTES_BY_CATEGORY.map((category) => {
    const routeList = (routes: Route[]) =>
      routes
        .map((r) => `<li><a href="/${r.path}">${escapeHtml(r.title)}</a></li>`)
        .join("")
    const groups = (category.groups ?? [])
      .map(
        (g: RouteGroup) =>
          `<h3>${escapeHtml(g.title)}</h3><ul>${routeList(g.routes)}</ul>`,
      )
      .join("")
    const routes = category.routes ? `<ul>${routeList(category.routes)}</ul>` : ""
    const heading = category.title ? `<h2>${escapeHtml(category.title)}</h2>` : ""
    return `<section>${heading}${routes}${groups}</section>`
  }).join("")
  return (
    `<main><article><h1>${SITE_TITLE}</h1>` +
    `<p>Learn Starknet Privacy (STRK20) with simple examples - privacy pools, ` +
    `notes and nullifiers, viewing keys, the Starknet Wallet API, anonymizer ` +
    `contracts, and wallet-builder SDK flows. The full site as one Markdown ` +
    `file: <a href="/llms-full.txt">llms-full.txt</a>.</p>` +
    `${sections}</article></main>`
  )
}

async function collectRoutes(): Promise<string[][]> {
  const files = await getFiles(PAGES_DIR, new RegExp("index.tsx"))
  const routes: string[][] = []
  for (const file of files) {
    const parts = file.split(path.sep).reverse()
    const i = parts.findIndex((p) => p === "pages")
    const route = parts.slice(1, i).reverse()
    if (route.length > 0) {
      routes.push(route)
    }
  }
  return routes
}

async function main() {
  const shell = (await readFile(path.join(BUILD_DIR, "index.html"))).toString()

  // Pristine shell as the gh-pages SPA fallback - must be written before the
  // homepage shell gets its content injected.
  await writeFile(path.join(BUILD_DIR, "404.html"), shell)

  const routes = await collectRoutes()
  const urls: string[] = [`${SITE}/`]

  for (const routeParts of routes) {
    const route = routeParts.join("/")
    const page = loadPage(routeParts)
    const dir = path.join(BUILD_DIR, ...routeParts)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const rendered = page
      ? renderShell(shell, route, page, pageContent(page))
      : shell // no index.html.ts (shouldn't happen) - fall back to the shell
    await writeFile(path.join(dir, "index.html"), rendered)
    urls.push(`${SITE}/${route}`)
    console.log(`prerender: /${route}${page ? "" : " (shell only)"}`)
  }

  // Homepage last, so route stamping above never reads an injected shell.
  const home = renderShell(
    shell,
    "",
    {
      title: SITE_TITLE,
      description:
        "Learn Starknet Privacy (STRK20) with simple examples - privacy pools, " +
        "notes and nullifiers, viewing keys, the Starknet Wallet API, anonymizer " +
        "contracts, and wallet-builder SDK flows.",
    },
    homeContent(),
  )
  await writeFile(path.join(BUILD_DIR, "index.html"), home)
  console.log("prerender: / (homepage)")

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`
  await writeFile(path.join(BUILD_DIR, "sitemap.xml"), sitemap)

  const robots =
    `User-agent: *\n` +
    `Allow: /\n\n` +
    `Sitemap: ${SITE}/sitemap.xml\n\n` +
    `# AI agents: every page has a raw-Markdown mirror at <route>.md.\n` +
    `# Index: ${SITE}/llms.txt - full site in one file: ${SITE}/llms-full.txt\n`
  await writeFile(path.join(BUILD_DIR, "robots.txt"), robots)

  console.log(`prerender: sitemap.xml (${urls.length} urls), robots.txt, 404.html`)
}

main()
