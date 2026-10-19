"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { useExploreMenuControls } from "./explore-menu-context"
import { focusRing } from "./focus-ring"
import { ChevronDown, navLinkHover } from "./nav-bar"

/** Grace period before a hover-opened menu closes, so the pointer can cross edges. */
const CLOSE_DELAY_MS = 120

/**
 * The Explore item as a disclosure for the mega nav, behaving as on
 * getsmarter.com: the pointer opens it on hover and it closes once the
 * pointer has left both the button and the panel. A pointer that leaves the
 * button into the bar and keeps heading down, as it does on its way across
 * to a far column, keeps it open until it arrives. A click or Enter opens it
 * to stay (a click on a hover-opened menu keeps it open), and it closes with
 * a second click, Escape, a click elsewhere, or focus moving past it. While
 * open the button shows the live site's open state: a darker ground, a pink
 * rule along its foot and an upturned chevron. Each opening starts at the
 * top of the panel.
 *
 * The panel is positioned against the sticky header, so it spans the window
 * directly beneath the bars; it follows the button in the DOM, so Tab moves
 * from the button into its links.
 */
export default function ExploreMenu({ children }: { children: React.ReactNode }) {
  const panelId = useId()
  const controls = useExploreMenuControls()
  const pinned = controls?.pinned ?? false

  const [open, setOpen] = useState(false)
  // How the menu was opened: a hover-opened menu closes when the pointer
  // leaves; one opened by click or keyboard stays until dismissed.
  const openedBy = useRef<"hover" | "click" | null>(null)
  const closeTimer = useRef(0)
  // The pointermove listener following a pointer on its way to the panel.
  const heading = useRef<((event: PointerEvent) => void) | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const expanded = open || pinned

  const stopHeading = useCallback(() => {
    if (!heading.current) return
    document.removeEventListener("pointermove", heading.current)
    heading.current = null
  }, [])

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    stopHeading()
  }, [stopHeading])

  const close = useCallback(() => {
    cancelClose()
    openedBy.current = null
    setOpen(false)
  }, [cancelClose])

  /** Close a hover-opened menu after the grace period, unless the keyboard has claimed it. */
  const armClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      // Someone tabbed into the panel of a hover-opened menu: it is now
      // theirs, and stays until they dismiss it or move focus past it.
      // Keyboard focus resting on the button itself doesn't count.
      const active = document.activeElement
      if (active && panelRef.current?.contains(active) && active.matches(":focus-visible")) {
        openedBy.current = "click"
        stopHeading()
        return
      }
      close()
    }, CLOSE_DELAY_MS)
  }, [close, stopHeading])

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

  // Every opening starts at the top of the panel, wherever a short window
  // last left it scrolled.
  useLayoutEffect(() => {
    if (expanded) panelRef.current?.firstElementChild?.scrollTo({ top: 0 })
  }, [expanded])

  useEffect(() => cancelClose, [cancelClose])

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
        armClose()
        // Leaving the button into the bar above the panel: the panel spans
        // the window, so any move downward is a move towards it. Each one
        // restarts the grace period; a pause, or a move up or level, lets it
        // run out.
        const panelTop = panelRef.current?.getBoundingClientRect().top ?? 0
        if (event.clientY < panelTop) {
          let lastY = event.clientY
          heading.current = (move: PointerEvent) => {
            if (move.clientY > lastY) armClose()
            lastY = move.clientY
          }
          document.addEventListener("pointermove", heading.current)
        }
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
            cancelClose()
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
      <div ref={panelRef} id={panelId} hidden={!expanded} className="absolute inset-x-0 top-full">
        {children}
      </div>
    </div>
  )
}
