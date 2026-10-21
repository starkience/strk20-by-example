import { withBase } from "../lib/url"
import React, { useRef, useLayoutEffect, useEffect } from "react"
import { useAppContext } from "../contexts/AppContext"
import styles from "./Layout.module.css"
import SideNav from "./SideNav"
import Header from "./Header"
import Footer from "./Footer"

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const { state, toggleSideNav } = useAppContext()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = parseInt(sessionStorage.getItem("scroll") || "0") || 0
    }
  }, [])

  useEffect(() => {
    if (!state.sideNav) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && window.innerWidth <= 1000) toggleSideNav()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [state.sideNav])

  function onClick(path: string) {
    sessionStorage.setItem("scroll", (ref.current?.scrollTop || 0).toString())
    window.location.href = withBase(path)
  }

  return (
    <div className={styles.component}>
      <div
        ref={ref}
        className={styles.sideNav}
        data-open={state.sideNav}
        style={
          state.sideNav
            ? {
                width: "var(--side-nav-width)",
                padding: "20px 12px 60px 12px",
                borderRight: "1px solid var(--border-color)",
              }
            : {
                width: 0,
              }
        }
      >
        {state.sideNav ? <SideNav onClick={onClick} /> : null}
      </div>
      {state.sideNav && (
        <button
          className={styles.scrim}
          aria-label="Close documentation menu"
          onClick={toggleSideNav}
        />
      )}
      <div className={styles.main}>
        <Header />
        <div className={styles.children}>
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Layout
