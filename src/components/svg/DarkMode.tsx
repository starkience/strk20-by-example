import React from "react"

interface Props {
  size: number
  className?: string
}

// Moon icon - offered as the "switch to dark mode" action while in light mode
const DarkMode: React.FC<Props> = ({ size, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
    >
      <path d="M20.7 14.9a8.8 8.8 0 0 1-11.6-11.6A9.3 9.3 0 1 0 20.7 14.9z" />
    </svg>
  )
}

export default DarkMode
