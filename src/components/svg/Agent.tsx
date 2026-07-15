import React from "react"

interface Props {
  size: number
  className?: string
}

// Four-point sparkle - marks the AI agent-skill entry point
const Agent: React.FC<Props> = ({ size, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2zm7 12l1.1 3.1L23 18l-2.9.9L19 22l-1.1-3.1L15 18l2.9-.9L19 14z" />
    </svg>
  )
}

export default Agent
