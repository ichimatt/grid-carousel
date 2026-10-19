"use client"

import { focusRing } from "../../collections/components/focus-ring"
import { useExploreMenuControls } from "../../collections/components/explore-menu-context"

/**
 * The prototype's own controls, floating at the foot of the window above
 * the page: hold the menu open to study it. The layout keeps the open menu
 * clear of this pill on short windows (--overlay-bottom). The mega nav is
 * desktop only, so below 1250px the pill just says so.
 */
export default function PrototypeControls() {
  const controls = useExploreMenuControls()
  if (!controls) return null
  const { pinned, setPinned } = controls

  return (
    <aside
      aria-label="Prototype controls"
      className="fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm/5 text-ink shadow-elevation-outlined-5 forced-colors:border"
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
          {/* In forced colours the track takes an outline and the thumb the
              text colour, so the switch's position still shows its state. */}
          <span
            aria-hidden="true"
            className="relative h-5 w-9 rounded-full bg-[#b1c0cf] transition-colors group-aria-checked:bg-ink forced-colors:border forced-colors:border-[CanvasText]"
          >
            <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-elevation-1 transition-transform group-aria-checked:translate-x-4 forced-colors:top-px forced-colors:left-px forced-colors:bg-[CanvasText]" />
          </span>
          Keep it open
        </button>
      </div>
    </aside>
  )
}
