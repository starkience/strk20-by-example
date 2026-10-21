import React, { useEffect, useRef, useState } from "react"
import { withBase } from "../lib/url"
import styles from "./SiteNav.module.css"

const SITE = "https://strk20.starknet.io"
const LINKS = [
  ["Home", "/"],
  ["Use", "/app/live-apps"],
  ["Build", "/build"],
  ["Docs", "/docs/what-is-strk20"],
  ["RFPs", "/rfp"],
  ["Tutorials", "/#playlists"],
  ["Dashboard", "/dashboard"],
  ["Hackathon", "/hackathon"],
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <nav className={styles.nav} aria-label="Main website">
      <a className={styles.logo} href={`${SITE}/`} aria-label="STRK20 home">
        <img src={withBase("/strk20-logo.png")} width="110" height="26" alt="STRK20" />
      </a>
      <button
        ref={toggle}
        className={styles.toggle}
        type="button"
        aria-label={open ? "Close website menu" : "Open website menu"}
        aria-expanded={open}
        aria-controls="website-navigation"
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      <div
        id="website-navigation"
        className={`${styles.links} ${open ? styles.open : ""}`}
      >
        {LINKS.map(([label, path]) => (
          <a
            key={label}
            href={`${SITE}${path}`}
            onClick={() => setOpen(false)}
            className={label === "Docs" ? styles.active : undefined}
            aria-current={label === "Docs" ? "page" : undefined}
          >
            {label === "Hackathon" && (
              <span className={styles.dot} aria-hidden="true" />
            )}
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
