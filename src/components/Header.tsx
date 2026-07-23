import React from "react"
import { useAppContext } from "../contexts/AppContext"
import Hamburger from "./svg/Hamburger"
import styles from "./Header.module.css"
import DarkMode from "./svg/DarkMode"
import LightMode from "./svg/LightMode"
import Strk20 from "./svg/Strk20"
import Agent from "./svg/Agent"
import HeaderSearch from "./HeaderSearch"

function Header() {
  const { state, setTheme, toggleSideNav } = useAppContext()

  function onClickTheme() {
    setTheme(state.theme == "light" ? "dark" : "light")
  }

  return (
    <div className={styles.component}>
      <button
        className={styles.navToggle}
        onClick={toggleSideNav}
        title="Toggle navigation"
        aria-label="Toggle navigation"
      >
        <Hamburger size={20} className={styles.hamburger} />
      </button>
      <div className={styles.center}>
        <div className={styles.centerInner}>
          <a href="/" className={styles.a} aria-label="STRK20 by Example home">
            <Strk20 className={styles.logo} size={20} />
          </a>
          <span className={styles.header}>
            <a href="/" className={styles.a}>
              by Example
            </a>
          </span>
        </div>
      </div>
      <div className={styles.right}>
        <HeaderSearch />
        <a
          href="/agent-skill"
          className={styles.agentLink}
          title="Let a coding agent build your STRK20 integration"
          aria-label="Agent skill"
        >
          <Agent size={18} />
          <span className={styles.agentLabel}>Agent skill</span>
        </a>
        <button
          className={styles.mode}
          onClick={onClickTheme}
          title={state.theme == "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={
            state.theme == "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {state.theme == "dark" ? <LightMode size={20} /> : <DarkMode size={18} />}
        </button>
      </div>
    </div>
  )
}

export default Header
