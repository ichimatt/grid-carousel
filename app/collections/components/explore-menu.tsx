"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useExploreMenuControls } from "./explore-menu-context"
import { focusRing } from "./focus-ring"
import { ChevronDown, navLinkHover } from "./nav-bar"

/** Grace period before a hover-opened menu closes, so the pointer can cross edges. */
const CLOSE_DELAY_MS = 120

/**
 * The Explore item as a disclosure for the mega nav, behaving as on
 * getsmarter.com: the pointer opens it on hover and it closes once the
 * pointer has left both the button and the panel. A click or Enter opens it
 * to stay (a click on a hover-opened menu keeps it open), and it closes with
 * a second click, Escape, a click elsewhere, or focus moving past it. While
 * open the button shows the live site's open state: a darker ground, a pink
 * rule along its foot and an upturned chevron.
 *
 * The panel is positioned against the sticky header, so it spans the window
 * directly beneath the bars; it follows the button in the DOM, so Tab moves
 * from the button into its links.
 */
export default function ExploreMenu({ children }: { children: React.ReactNode }) {
  const panelId = useId()
  const controls = useExploreMenuControls()
  const pinned = controls?.pinned ?? false
  const playbookColours = controls?.playbookColours ?? "drawn"

  const [open, setOpen] = useState(false)
  // How the menu was opened: a hover-opened menu closes when the pointer
  // leaves; one opened by click or keyboard stays until dismissed.
  const openedBy = useRef<"hover" | "click" | null>(null)
  const closeTimer = useRef(0)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const expanded = open || pinned

  const cancelClose = () => window.clearTimeout(closeTimer.current)

  const close = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    openedBy.current = null
    setOpen(false)
  }, [])

  // While open: Escape closes and returns focus to the button if it was in
  // the menu; a press anywhere outside closes.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      const hadFocus = rootRef.current?.contains(document.activeElement)
      close()
      if (hadFocus) buttonRef.current?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open, close])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  return (
    <div
      ref={rootRef}
      className="flex"
      onPointerEnter={(event) => {
        // Touch has no hover: a tap is a click. A pinned menu is already
        // open and ignores the pointer, so unpinning leaves it closed.
        if (event.pointerType === "touch" || pinned) return
        cancelClose()
        if (!open) {
          openedBy.current = "hover"
          setOpen(true)
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch" || openedBy.current !== "hover") return
        cancelClose()
        closeTimer.current = window.setTimeout(() => {
          // Someone tabbed into the panel of a hover-opened menu: it is now
          // theirs, and stays until they dismiss it or move focus past it.
          // Keyboard focus resting on the button itself doesn't count.
          const active = document.activeElement
          if (active && panelRef.current?.contains(active) && active.matches(":focus-visible")) {
            openedBy.current = "click"
            return
          }
          close()
        }, CLOSE_DELAY_MS)
      }}
      onBlur={(event) => {
        // Focus moving out of the button and panel closes a menu opened by
        // click or Enter, or claimed by keyboard focus; focus moving within
        // them doesn't.
        const next = event.relatedTarget as Node | null
        if (next && !rootRef.current?.contains(next) && openedBy.current === "click") close()
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => {
          if (pinned) return
          if (!open) {
            openedBy.current = "click"
            setOpen(true)
          } else if (openedBy.current === "hover") {
            openedBy.current = "click"
          } else {
            close()
          }
        }}
        className={`group flex items-center gap-4 px-2.5 ${navLinkHover} aria-expanded:bg-[#06101a] aria-expanded:shadow-[inset_0_-4px_0_var(--color-primary-text)] ${focusRing}`}
      >
        Explore
        <ChevronDown className="motion-safe:transition-transform group-aria-expanded:rotate-180" />
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!expanded}
        data-playbook-colours={playbookColours}
        className="absolute inset-x-0 top-full"
      >
        {children}
      </div>
    </div>
  )
}
