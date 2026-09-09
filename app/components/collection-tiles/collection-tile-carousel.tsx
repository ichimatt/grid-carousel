"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ControlChevronLeftIcon, ControlChevronRightIcon } from "../collection-carousel/icons"
import { getPositions, nearestIndex, resolveIndex } from "../scroll-geometry"
import CollectionTile from "./collection-tile"
import styles from "./collection-tile-carousel.module.css"
import { collectionTiles, type CollectionTileData } from "./tiles"

export type CollectionTileCarouselLabels = {
  previous?: string
  next?: string
  pages?: string
  /** aria-label for a dot when every page is one tile. */
  tile?: (index: number, count: number, title: string) => string
  /** aria-label for a dot when a page holds several tiles. */
  page?: (index: number, count: number) => string
  slide?: (index: number, count: number) => string
  /** Screen-reader status after the user changes page. */
  status?: (page: number, pageCount: number, perView: number, title: string) => string
}

export type CollectionTileCarouselProps = {
  items?: CollectionTileData[]
  /** Accessible name for the carousel region. */
  label?: string
  labels?: CollectionTileCarouselLabels
}

const defaultLabels = {
  previous: "Previous page",
  next: "Next page",
  pages: "Choose a page",
  tile: (index: number, count: number, title: string) =>
    `Go to tile ${index + 1} of ${count}: ${title}`,
  page: (index: number, count: number) => `Go to page ${index + 1} of ${count}`,
  slide: (index: number, count: number) => `${index + 1} of ${count}`,
  status: (page: number, pageCount: number, perView: number, title: string) =>
    perView === 1
      ? `Tile ${page + 1} of ${pageCount}: ${title}`
      : `Page ${page + 1} of ${pageCount}`,
} satisfies Required<CollectionTileCarouselLabels>

/** How long a control-initiated smooth scroll may take before the dots stop waiting for it. */
const SCROLL_SETTLE_MS = 1500
/** Debounce stand-in for `scrollend` in browsers that don't fire it. */
const SCROLL_IDLE_MS = 160

type Layout = {
  perView: number
  /** Snap position of the first tile of each page. */
  pagePositions: number[]
}

/**
 * Pages are derived from live geometry and the --spv custom property the
 * container queries set, so they stay right across resizes. On the rail
 * every tile is a page, even the last few that share the end position, so
 * there is one dot per tile as designed. With several tiles per page,
 * consecutive pages that clamp to the same end position collapse into one.
 */
function getLayout(track: HTMLElement): Layout {
  const perView = Math.max(
    1,
    Math.round(parseFloat(getComputedStyle(track).getPropertyValue("--page"))) || 1
  )
  const positions = getPositions(track)
  if (perView === 1) return { perView, pagePositions: positions }
  const pagePositions: number[] = []
  for (let i = 0; i < positions.length; i += perView) {
    const last = pagePositions[pagePositions.length - 1]
    if (last === undefined || Math.abs(positions[i] - last) > 1) pagePositions.push(positions[i])
  }
  return { perView, pagePositions }
}

/**
 * The tile carousel from the handover. Below 64rem it is a rail on the 24px
 * gutter, tiles sized so half of the next one always peeks (one and a half
 * visible, two and a half from 36rem, three and a half from 56rem), with one
 * dot per tile. From 64rem the gutters move outside the scroller and the
 * tiles fill a 1360px content width, as many per page as fit at a 198px
 * minimum; paging controls appear only when they don't all fit. There is no
 * auto-rotation.
 */
export default function CollectionTileCarousel({
  items = collectionTiles,
  label = "Course collections",
  labels,
}: CollectionTileCarouselProps) {
  const id = useId()
  const trackId = `${id}track`
  const text = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  const count = items.length

  const trackRef = useRef<HTMLDivElement | null>(null)
  const pageRef = useRef(0)
  // Page a control is scrolling towards; while set, scroll events don't move
  // the dots so they point at the destination, not each page passed.
  const pendingRef = useRef<number | null>(null)
  const settleTimerRef = useRef(0)
  const idleTimerRef = useRef(0)
  const swipeRef = useRef(false)
  const announcedRef = useRef(-1)

  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(count)
  const [perView, setPerView] = useState(1)
  const [measured, setMeasured] = useState(false)
  // Whether the track is at either scroll limit. Tiles snap individually, so
  // in paged mode the track can rest between page positions; the arrows must
  // judge the ends from the real offset, not from the nearest page.
  const [edges, setEdges] = useState({ start: true, end: false })
  // seq forces a DOM mutation even when the same page is announced twice.
  const [status, setStatus] = useState({ text: "", seq: 0 })

  const clearPending = useCallback(() => {
    pendingRef.current = null
    window.clearTimeout(settleTimerRef.current)
  }, [])

  const announce = useCallback(
    (target: number, pages: number, spv: number) => {
      announcedRef.current = target
      const first = items[Math.min(target * spv, count - 1)]
      setStatus((previous) => ({
        text: text.status(target, pages, spv, first?.title ?? ""),
        seq: previous.seq + 1,
      }))
    },
    [count, items, text]
  )

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { perView: spv, pagePositions } = getLayout(track)
    setPerView(spv)
    setPageCount(pagePositions.length)
    const maxScroll = track.scrollWidth - track.clientWidth
    setEdges({ start: track.scrollLeft <= 1, end: track.scrollLeft >= maxScroll - 1 })
    const pending = pendingRef.current
    if (pending != null) {
      const target = Math.min(pending, pagePositions.length - 1)
      if (Math.abs(track.scrollLeft - pagePositions[target]) >= 2) return
      clearPending()
    }
    // Tiles that share the clamped end position keep the one the user chose.
    const next =
      spv === 1
        ? resolveIndex(pagePositions, track.scrollLeft, pageRef.current)
        : nearestIndex(pagePositions, track.scrollLeft)
    if (next === pageRef.current) return
    pageRef.current = next
    setPage(next)
  }, [clearPending])

  const goTo = useCallback(
    (target: number, options: { announce?: boolean } = {}) => {
      const track = trackRef.current
      if (!track) return
      const { perView: spv, pagePositions } = getLayout(track)
      const next = Math.max(0, Math.min(target, pagePositions.length - 1))
      clearPending()
      pendingRef.current = next
      pageRef.current = next
      setPage(next)
      if (options.announce !== false) announce(next, pagePositions.length, spv)
      swipeRef.current = false
      // A cancelled smooth scroll never reaches the destination, so don't
      // wait for it forever.
      settleTimerRef.current = window.setTimeout(() => {
        pendingRef.current = null
        sync()
      }, SCROLL_SETTLE_MS)
      // The track's CSS scroll-behavior decides, so prefers-reduced-motion
      // users get an instant jump.
      track.scrollTo({ left: pagePositions[next] })
    },
    [announce, clearPending, sync]
  )

  /** Move to the first page position strictly beyond (or before) where the track is now. */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const { pagePositions } = getLayout(track)
    const here = track.scrollLeft
    let target = direction === 1 ? pagePositions.length - 1 : 0
    if (direction === 1) {
      const ahead = pagePositions.findIndex((position) => position > here + 1)
      if (ahead !== -1) target = ahead
    } else {
      pagePositions.forEach((position, index) => {
        if (position < here - 1) target = index
      })
    }
    goTo(target)
  }

  /** Bring a tile that receives focus fully onto its page, keeping the dots in step. */
  const onTrackFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const slide = (event.target as HTMLElement).closest("article")
    if (!track || !slide) return
    const index = Array.from(track.children).indexOf(slide)
    if (index === -1) return
    const { perView: spv, pagePositions } = getLayout(track)
    const target = Math.min(Math.floor(index / spv), pagePositions.length - 1)
    if (target !== pageRef.current || Math.abs(track.scrollLeft - pagePositions[target]) > 1) {
      goTo(target, { announce: false })
    }
  }

  // Re-measure pages and keep the current page aligned across resizes.
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    sync()
    setMeasured(true)
    let width = track.clientWidth
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === width) return
      width = track.clientWidth
      clearPending()
      const { pagePositions } = getLayout(track)
      const target = Math.min(pageRef.current, pagePositions.length - 1)
      track.scrollTo({ left: pagePositions[target], behavior: "instant" })
      pageRef.current = target
      setPage(target)
      setPageCount(pagePositions.length)
      sync()
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [sync, clearPending])

  // Follow swipes and native scrolling; announce only once a swipe settles.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const settle = () => {
      clearPending()
      const wasSwipe = swipeRef.current
      swipeRef.current = false
      sync()
      if (wasSwipe && pageRef.current !== announcedRef.current) {
        const { perView: spv, pagePositions } = getLayout(track)
        announce(pageRef.current, pagePositions.length, spv)
      }
    }
    const hasScrollEnd = "onscrollend" in window
    let frame = 0
    const onScroll = () => {
      if (!hasScrollEnd) {
        window.clearTimeout(idleTimerRef.current)
        idleTimerRef.current = window.setTimeout(settle, SCROLL_IDLE_MS)
      }
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }
    const startSwipe = () => {
      swipeRef.current = true
      clearPending()
    }

    track.addEventListener("scroll", onScroll, { passive: true })
    if (hasScrollEnd) track.addEventListener("scrollend", settle)
    track.addEventListener("pointerdown", startSwipe, { passive: true })
    track.addEventListener("touchstart", startSwipe, { passive: true })
    track.addEventListener("wheel", startSwipe, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      clearPending()
      window.clearTimeout(idleTimerRef.current)
      track.removeEventListener("scroll", onScroll)
      if (hasScrollEnd) track.removeEventListener("scrollend", settle)
      track.removeEventListener("pointerdown", startSwipe)
      track.removeEventListener("touchstart", startSwipe)
      track.removeEventListener("wheel", startSwipe)
    }
  }, [sync, announce, clearPending])

  const atStart = edges.start
  const atEnd = edges.end

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      data-measured={measured || undefined}
      className={`${styles.root} bg-sunken font-noto text-ink`}
    >
      {/* Vertical rhythm from the file: 40px above the rail and 48px below
          it on mobile; 64px above and below the row on desktop. */}
      <div className="flex flex-col gap-8 pt-10 pb-12 @5xl:pt-16 @5xl:pb-16">
        {/* Controls precede the tiles in the DOM so they're reached first;
            CSS order places them below, as designed. They only exist when
            there is more than one page. */}
        {pageCount > 1 && (
          <div className={`${styles.controls} order-last flex items-center justify-center gap-4`}>
            <ControlButton label={text.previous} controls={trackId} disabled={atStart} onClick={() => step(-1)}>
              <ControlChevronLeftIcon />
            </ControlButton>
            <div role="group" aria-label={text.pages} className="flex items-center gap-4">
              {Array.from({ length: pageCount }, (_, position) => (
                <button
                  key={position}
                  type="button"
                  aria-label={
                    perView === 1
                      ? text.tile(position, pageCount, items[position]?.title ?? "")
                      : text.page(position, pageCount)
                  }
                  aria-controls={trackId}
                  aria-current={position === page ? "true" : undefined}
                  onClick={() => goTo(position)}
                  className={`${styles.dot} relative size-2.5 rounded-full after:absolute after:-inset-2 after:content-['']`}
                />
              ))}
            </div>
            <ControlButton label={text.next} controls={trackId} disabled={atEnd} onClick={() => step(1)}>
              <ControlChevronRightIcon />
            </ControlButton>
          </div>
        )}

        <p role="status" aria-atomic="true" className="sr-only">
          {status.text}
          {status.seq % 2 === 1 ? " " : ""}
        </p>

        {/* On the rail the gutter is padding inside the scroller so the
            next tile peeks through it. On desktop the gutters sit outside a
            1360px scroller, which keeps a 12px margin of its own so shadows
            and focus rings aren't clipped at the edges; the next page's
            first tile starts exactly one 12px gap beyond, so it stays hidden. */}
        <div className="@5xl:px-6">
          <div className="@5xl:mx-auto @5xl:max-w-[1360px]">
            <div
              ref={trackRef}
              id={trackId}
              role="group"
              aria-label={label}
              onFocusCapture={onTrackFocus}
              className={`${styles.track} -my-3 flex gap-3 px-6 py-3 scroll-px-6 @5xl:-mx-3 @5xl:px-3 @5xl:scroll-px-3`}
            >
            {items.map((item, position) => (
              <article
                key={item.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={text.slide(position, count)}
                className="flex w-[calc((100%_+_var(--visible-padding)_-_var(--gaps)_*_0.75rem)_/_var(--spv))] shrink-0 snap-start"
              >
                <CollectionTile tile={item} />
              </article>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ControlButton({
  label,
  controls,
  disabled,
  onClick,
  children,
}: {
  label: string
  controls: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onClick()
      }}
      // The design dims a control at the end of its range rather than
      // removing it; keeping it focusable means keyboard users don't lose
      // their place when they reach an end. States live in the module.
      className={`${styles.control} hidden size-8 place-items-center rounded-full @5xl:grid`}
    >
      {children}
    </button>
  )
}
