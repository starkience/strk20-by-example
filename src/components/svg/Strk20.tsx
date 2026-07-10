import React from "react"
import { useAppContext } from "../../contexts/AppContext"

interface Props {
  size: number
  className?: string
}

// STRK[20] wordmark. The artwork has white lettering, so light mode uses an
// ink-recolored variant of the same logo.
const Strk20: React.FC<Props> = ({ size, className = "" }) => {
  const { state } = useAppContext()

  return (
    <img
      src={state.theme === "dark" ? "/strk20-logo.png" : "/strk20-logo-ink.png"}
      alt="STRK20"
      height={size}
      style={{ height: size, width: "auto", display: "block" }}
      className={className}
    />
  )
}

export default Strk20
