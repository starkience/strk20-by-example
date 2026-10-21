import { withBase } from "../lib/url"
import React from "react"
import { useAppContext } from "../contexts/AppContext"
import Hamburger from "./svg/Hamburger"
import styles from "./Header.module.css"
import Agent from "./svg/Agent"
import HeaderSearch from "./HeaderSearch"

export default function Header() {
  const { state, toggleSideNav } = useAppContext()
  return (
    <header className={styles.component}>
      <div className={styles.section}>
        <button
          className={styles.navToggle}
          onClick={toggleSideNav}
          aria-label="Toggle documentation menu"
          aria-expanded={state.sideNav}
        >
          <Hamburger size={18} />
        </button>
        <a href={withBase("/")} className={styles.label}>
          Documentation
        </a>
      </div>
      <div className={styles.right}>
        <HeaderSearch />
        <a
          href={withBase("/agent-skill")}
          className={styles.agentLink}
          aria-label="Agent skill"
        >
          <Agent size={16} />
          <span className={styles.agentLabel}>Agent skill</span>
        </a>
      </div>
    </header>
  )
}
