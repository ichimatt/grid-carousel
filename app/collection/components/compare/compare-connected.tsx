"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { compareAttributes, courses } from "../../data"
import { AttributeValue, CourseHeading, StageBand } from "./shared"
import styles from "./compare-connected.module.css"

const CELL_COUNT = compareAttributes.length

function getPositions(track: HTMLElement): number[] {
  const cells = Array.from(track.children) as HTMLElement[]
  if (cells.length === 0) return [0]
  const max = Math.max(0, track.scrollWidth - track.clientWidth)
  const origin = cells[0].getBoundingClientRect().left
  return cells.map((cell) =>
    Math.min(max, Math.max(0, cell.getBoundingClientRect().left - origin))
  )
}

function nearestIndex(positions: number[], left: number): number {
  let nearest = 0
  for (let i = 1; i < positions.length; i++) {
    if (Math.abs(positions[i] - left) < Math.abs(positions[nearest] - left)) {
      nearest = i
    }
  }
  return nearest
}

/**
 * Prototype 3 — every course's compare cells live in their own scroll-snap
 * carousel, and the carousels are connected: dragging any one of them (or
 * using the shared controls) scrolls all of them in lockstep, so the page
 * always shows one attribute "column" at a time.
 */
export default function CompareConnected() {
  const tracksRef = useRef<(HTMLDivElement | null)[]>([])
  const activeRef = useRef<HTMLDivElement | null>(null)
  const pendingRef = useRef<number | null>(null)
  const frameRef = useRef(0)
  const pageRef = useRef(0)
  const [page, setPage] = useState(0)

  const goTo = useCallback((target: number, behavior?: ScrollBehavior) => {
    const tracks = tracksRef.current.filter(Boolean) as HTMLDivElement[]
    if (tracks.length === 0) return
    const clamped = Math.max(0, Math.min(target, CELL_COUNT - 1))
    activeRef.current = null
    pendingRef.current = clamped
    pageRef.current = clamped
    setPage(clamped)
    for (const track of tracks) {
      track.dataset.follower = "false"
      const positions = getPositions(track)
      const left = positions[Math.min(clamped, positions.length - 1)]
      // Without an explicit behavior the track's CSS scroll-behavior decides,
      // so prefers-reduced-motion users get an instant jump.
      track.scrollTo(behavior ? { left, behavior } : { left })
    }
  }, [])

  useEffect(() => {
    const tracks = tracksRef.current.filter(Boolean) as HTMLDivElement[]
    if (tracks.length === 0) return

    const sync = (source: HTMLDivElement) => {
      const left = source.scrollLeft
      for (const track of tracks) {
        if (track !== source && Math.abs(track.scrollLeft - left) > 0.5) {
          track.scrollLeft = left
        }
      }
      const positions = getPositions(source)
      if (pendingRef.current != null) {
        const target = Math.min(pendingRef.current, positions.length - 1)
        if (Math.abs(left - positions[target]) >= 2) return
        pendingRef.current = null
      }
      const nearest = nearestIndex(positions, left)
      pageRef.current = nearest
      setPage(nearest)
    }

    const cleanups = tracks.map((track) => {
      const onScroll = () => {
        // Mirrored tracks echo scroll events; only the driven track syncs.
        if (activeRef.current && activeRef.current !== track) return
        if (frameRef.current) return
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0
          sync(activeRef.current ?? track)
        })
      }
      const claim = () => {
        activeRef.current = track
        pendingRef.current = null
        for (const other of tracks) {
          other.dataset.follower = other === track ? "false" : "true"
        }
      }
      track.addEventListener("scroll", onScroll, { passive: true })
      track.addEventListener("pointerdown", claim, { passive: true })
      track.addEventListener("wheel", claim, { passive: true })
      track.addEventListener("keydown", claim)
      return () => {
        track.removeEventListener("scroll", onScroll)
        track.removeEventListener("pointerdown", claim)
        track.removeEventListener("wheel", claim)
        track.removeEventListener("keydown", claim)
      }
    })

    // Keep every track on the current cell when the layout resizes.
    let width = tracks[0].clientWidth
    const observer = new ResizeObserver(() => {
      if (tracks[0].clientWidth === width) return
      width = tracks[0].clientWidth
      goTo(pageRef.current, "instant")
    })
    observer.observe(tracks[0])

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      observer.disconnect()
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
    }
  }, [goTo])

  return (
    <div className="lg:hidden">
      {/* Shared controls: one pager drives all five carousels. */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-sm/[26px] font-bold" aria-live="polite">
          {compareAttributes[page].label}
        </p>
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Previous attribute"
            aria-disabled={page === 0}
            onClick={() => page > 0 && goTo(page - 1)}
            className="grid size-9 place-items-center rounded-full aria-disabled:opacity-35"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m10 3.5-4.5 4.5 4.5 4.5" />
            </svg>
          </button>
          <div className="flex" role="group" aria-label="Compare attributes">
            {compareAttributes.map((attribute, index) => (
              <button
                key={attribute.key}
                type="button"
                aria-label={`${attribute.label} (${index + 1} of ${CELL_COUNT})`}
                aria-current={index === page ? "true" : undefined}
                onClick={() => goTo(index)}
                className="grid size-6 place-items-center"
              >
                <span
                  className={`size-2 rounded-full transition-opacity ${
                    index === page ? "bg-wf" : "bg-wf/25"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next attribute"
            aria-disabled={page === CELL_COUNT - 1}
            onClick={() => page < CELL_COUNT - 1 && goTo(page + 1)}
            className="grid size-9 place-items-center rounded-full aria-disabled:opacity-35"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 3.5 4.5 4.5L6 12.5" />
            </svg>
          </button>
        </div>
      </div>

      <ul className="mt-2">
        {courses.map((course, courseIndex) => (
          <li key={course.slug} className="pb-7 pt-3 first:pt-1">
            <StageBand>{course.stage}</StageBand>
            <CourseHeading course={course} />
            <div
              ref={(el) => {
                tracksRef.current[courseIndex] = el
              }}
              role="group"
              aria-roledescription="carousel"
              aria-label={`${course.title} comparison details`}
              tabIndex={0}
              className={`${styles.track} mt-4 [--gap:var(--grid-gutter,0.75rem)] [--pad:calc(1rem+var(--grid-gutter,0.75rem))]`}
            >
              {compareAttributes.map((attribute, cellIndex) => (
                <div
                  key={attribute.key}
                  className={styles.cell}
                  role="group"
                  aria-label={`${attribute.label} (${cellIndex + 1} of ${CELL_COUNT})`}
                >
                  <div className="flex h-full flex-col rounded-lg border border-wf px-4 py-2.5">
                    <p className="text-sm/[26px] font-bold">{attribute.label}</p>
                    <AttributeValue course={course} attribute={attribute} />
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
