import React from "react"
import SEO from "./SEO"
import Html from "./Html"
import styles from "./Example.module.css"

interface Path {
  title: string
  path: string
}

interface Code {
  fileName: string
  code: string
}

interface Props {
  title: string
  description: string
  version: string
  html: string
  githubLink?: string
  githubLabel?: string
  prev: Path | null
  next: Path | null
  codes: Code[]
}

const Example: React.FC<Props> = ({
  title,
  version,
  description,
  githubLink,
  githubLabel,
  html,
  prev,
  next,
  codes,
}) => {
  return (
    <div className={styles.component}>
      <SEO
        title={`${title} | STRK20 by Example`}
        description={description}
        githubLink={githubLink}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>

        {githubLink ? (
          <div className={styles.sourceLink}>
            View the full source in the{" "}
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              {githubLabel || "starknet-privacy repo"}
            </a>
          </div>
        ) : null}

        <Html html={html} />

        <nav className={styles.prevNext} aria-label="Previous and next pages">
          {prev ? (
            <a href={prev.path} className={styles.prevLink}>
              <span className={styles.pagerLabel}>&larr; Previous</span>
              <span className={styles.pagerTitle}>{prev.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a href={next.path} className={styles.nextLink}>
              <span className={styles.pagerLabel}>Next &rarr;</span>
              <span className={styles.pagerTitle}>{next.title}</span>
            </a>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  )
}

export default Example
