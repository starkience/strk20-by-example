import path from "path"
export const PREFIX = (process.env.VITE_PUBLIC_URL || "").replace(/\/+$/, "")
export const SITE = (
  process.env.SITE_URL ||
  (PREFIX ? `https://strk20.starknet.io${PREFIX}` : "https://strk20-by-example.org")
).replace(/\/+$/, "")
export const BUILD_DIR = path.join(__dirname, "..", `build${PREFIX}`)
export function mountLinks(html: string): string {
  return PREFIX
    ? html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (match, attr, rest) =>
        rest === PREFIX.slice(1) || rest.startsWith(`${PREFIX.slice(1)}/`)
          ? match
          : `${attr}="${PREFIX}/${rest}"`,
      )
    : html
}
