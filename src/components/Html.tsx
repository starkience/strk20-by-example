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
  useEffect(() => {
    const hash = window.location.hash
    if (hash.length > 1) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    }
  }, [html])

  return (
    <div className={`code ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default Html
