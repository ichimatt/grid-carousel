"use client"

import { createContext, useContext, useMemo, useState } from "react"

export type PlaybookColours = "drawn" | "own"

type ExploreMenuControls = {
  /** Holds the menu open whatever the pointer and keyboard do. */
  pinned: boolean
  setPinned: (pinned: boolean) => void
  /** "drawn" as in the Figma frame; "own" gives each playbook its theme. */
  playbookColours: PlaybookColours
  setPlaybookColours: (colours: PlaybookColours) => void
}

/**
 * Lets a prototype page steer the Explore menu inside the shared header.
 * Outside a provider the menu behaves as it would on the live site.
 */
const ExploreMenuControlsContext = createContext<ExploreMenuControls | null>(null)

export function ExploreMenuControlsProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState(false)
  const [playbookColours, setPlaybookColours] = useState<PlaybookColours>("drawn")
  const value = useMemo(
    () => ({ pinned, setPinned, playbookColours, setPlaybookColours }),
    [pinned, playbookColours]
  )
  return (
    <ExploreMenuControlsContext.Provider value={value}>{children}</ExploreMenuControlsContext.Provider>
  )
}

export function useExploreMenuControls() {
  return useContext(ExploreMenuControlsContext)
}
