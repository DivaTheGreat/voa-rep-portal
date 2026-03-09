import { useState } from "react"
import Portal from "./Portal.jsx"
import Onboarding from "./Onboarding.jsx"

export default function App() {
  const [view, setView] = useState("portal")

  // Simple path-based routing using URL hash
  const hash = window.location.hash
  if (hash === "#apply" || hash === "#onboarding") {
    return <Onboarding />
  }

  return <Portal />
}
