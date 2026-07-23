import React from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider as AppContextProvider } from "./contexts/AppContext"
import App from "./App"

// Routes are prerendered (scripts/prerender.ts), so #root usually arrives with
// static content in it. That content is a plain-HTML stand-in, not the React
// tree, so hydrateRoot would mismatch on every node - render() instead, which
// swaps the static content for the app in one commit.
const container = document.getElementById("root")
createRoot(container!).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
)
