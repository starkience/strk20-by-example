import React, { useEffect } from "react"
import useCopy from "../hooks/useCopy"

interface Props {
  className?: string
  html: string
}

const Html: React.FC<Props> = ({ className = "", html }) => {
  useCopy([])

  // The SPA injects content after the browser has already tried (and failed)
  // to scroll to the URL hash - do it ourselves once the html is in the DOM.
  // A short delay lets the page paint at the top first, so the smooth scroll
  // reads as travel down to the section instead of an instant jump.
  useEffect(() => {
    const hash = window.location.hash
    if (hash.length > 1) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const timer = setTimeout(
          () => {
            el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
            el.classList.add("anchor-flash")
          },
          reduced ? 0 : 150,
        )
        return () => {
          clearTimeout(timer)
          el.classList.remove("anchor-flash")
        }
      }
    }
  }, [html])

  return (
    <div className={`code ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default Html
