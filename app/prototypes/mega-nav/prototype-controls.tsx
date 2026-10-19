"use client"

import { focusRing } from "../../collections/components/focus-ring"
import { useExploreMenuControls } from "../../collections/components/explore-menu-context"

/**
 * The prototype's own controls, floating at the foot of the window above
 * the page and the menu: hold the menu open to study it, and compare the
 * playbook rows as drawn (one shared theme) with each in its own theme
 * (choosing either also holds the menu open).
 * The mega nav is desktop only, so below 1250px this just says so.
 */
export default function PrototypeControls() {
  const controls = useExploreMenuControls()
  if (!controls) return null
  const { pinned, setPinned, playbookColours, setPlaybookColours } = controls

  return (
    <aside
      aria-label="Prototype controls"
      className="fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm/5 text-ink shadow-elevation-outlined-5"
    >
      <p className="navbar:hidden">
        The mega nav is desktop only: widen the window to 1250px or more.
      </p>
      <div className="hidden items-center gap-5 navbar:flex">
        <p className="font-semibold">Mega nav prototype</p>
        <p className="text-ink-secondary">Hover over Explore, or tab to it and press Enter.</p>
        <button
          type="button"
          role="switch"
          aria-checked={pinned}
          onClick={() => setPinned(!pinned)}
          className={`group flex items-center gap-2 rounded-full ${focusRing}`}
        >
          <span
            aria-hidden="true"
            className="relative h-5 w-9 rounded-full bg-[#b1c0cf] transition-colors group-aria-checked:bg-ink"
          >
            <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-elevation-1 transition-transform group-aria-checked:translate-x-4" />
          </span>
          Keep it open
        </button>
        <div role="group" aria-label="Playbook colours" className="flex items-center gap-2">
          <span aria-hidden="true" className="text-ink-secondary">
            Playbook colours
          </span>
          <div className="flex rounded-full bg-sunken p-0.5">
            {(
              [
                { value: "drawn", label: "As drawn" },
                { value: "own", label: "Each its own" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={playbookColours === option.value}
                // Choosing a scheme holds the menu open, so the rows it
                // changes are on screen to compare.
                onClick={() => {
                  setPlaybookColours(option.value)
                  setPinned(true)
                }}
                className={`rounded-full px-3 py-0.5 transition-colors aria-pressed:bg-white aria-pressed:font-medium aria-pressed:shadow-elevation-1 ${focusRing}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
