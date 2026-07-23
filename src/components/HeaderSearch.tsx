import React, { useEffect, useRef, useState } from "react"
import Search from "./svg/Search"
import useDebounce from "../hooks/useDebounce"
import { search, SearchResult } from "../lib/search"
import styles from "./HeaderSearch.module.css"

const MAX_RESULTS = 8

// Highlight matched terms inside a snippet
function highlight(text: string, terms: string[]): React.ReactNode {
  if (terms.length === 0) {
    return text
  }

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"))

  return parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part))
}

function HeaderSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const componentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // avoid applying stale async results after the query has changed
  const latestQuery = useRef("")

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

  async function _search(q: string) {
    latestQuery.current = q

    if (q.trim().length === 0) {
      setResults(null)
      return
    }

    const res = await search(q)
    if (latestQuery.current === q) {
      setResults(res.slice(0, MAX_RESULTS))
      setActive(0)
    }
  }

  const _searchWithDelay = useDebounce((q: string) => _search(q), 150, [])

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
    _searchWithDelay(e.target.value)
  }

  function close() {
    setOpen(false)
    setExpanded(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || !results) {
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      const result = results[active]
      if (result) {
        window.location.assign(result.route)
      }
    } else if (e.key === "Escape") {
      close()
      inputRef.current?.blur()
    }
  }

  // Global ⌘K / Ctrl+K focuses search; outside click closes the dropdown
  useEffect(() => {
    function onGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setExpanded(true)
        setOpen(true)
        // the input may not exist yet when collapsed on mobile
        setTimeout(() => inputRef.current?.focus(), 0)
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (!componentRef.current?.contains(e.target as Node)) {
        close()
      }
    }

    document.addEventListener("keydown", onGlobalKeyDown)
    document.addEventListener("mousedown", onMouseDown)
    return () => {
      document.removeEventListener("keydown", onGlobalKeyDown)
      document.removeEventListener("mousedown", onMouseDown)
    }
  }, [])

  const showDropdown = open && results != null && query.trim().length > 0

  return (
    <div
      className={`${styles.component} ${expanded ? styles.expanded : ""}`}
      ref={componentRef}
    >
      <button
        className={styles.iconButton}
        onClick={() => {
          setExpanded(true)
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        title="Search"
        aria-label="Search"
      >
        <Search size={18} />
      </button>

      <div className={styles.inputWrap}>
        <Search size={15} className={styles.inputIcon} />
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Search docs"
          value={query}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search docs"
        />
        <span className={styles.kbd}>{isMac ? "⌘K" : "Ctrl K"}</span>
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {results.length === 0 ? (
            <div className={styles.noResults}>No results</div>
          ) : (
            <ul className={styles.list}>
              {results.map((result, i) => (
                <li key={result.route}>
                  <a
                    href={result.route}
                    className={`${styles.result} ${i === active ? styles.active : ""}`}
                    onMouseEnter={() => setActive(i)}
                  >
                    <div className={styles.resultTop}>
                      <span className={styles.resultTitle}>{result.title}</span>
                      <span className={styles.resultCategory}>{result.category}</span>
                    </div>
                    {result.snippet && (
                      <div className={styles.resultSnippet}>
                        {highlight(result.snippet, result.terms)}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default HeaderSearch
