"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { getPositions, nearestIndex, resolveIndex } from "../scroll-geometry"
import CollectionTile from "./collection-tile"
import styles from "./collection-tile-carousel.module.css"
import { collectionTiles, type CollectionTileData } from "./tiles"

export type CollectionTileCarouselLabels = {
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
 * Pages are derived from live geometry and the --tile-cols custom property
 * the container queries set, so they stay right across resizes. A track
 * with nothing to scroll is a single page, however many tiles it holds (two
 * or three upright tiles fit the rail from 504px and 744px). Otherwise, on
 * the rail every tile is a page, even the last few that share the end
 * position, so there is one dot per tile as designed. With several tiles
 * per page, consecutive pages that clamp to the same end position collapse
 * into one.
 */
function getLayout(track: HTMLElement): Layout {
  const perView = Math.max(
    1,
    Math.round(parseFloat(getComputedStyle(track).getPropertyValue("--tile-cols"))) || 1
  )
  const positions = getPositions(track)
  if (track.scrollWidth - track.clientWidth < 1) return { perView, pagePositions: [positions[0]] }
  if (perView === 1) return { perView, pagePositions: positions }
  const pagePositions: number[] = []
  for (let i = 0; i < positions.length; i += perView) {
    const last = pagePositions[pagePositions.length - 1]
    if (last === undefined || Math.abs(positions[i] - last) > 1) pagePositions.push(positions[i])
  }
  return { perView, pagePositions }
}

/**
 * The collection tile carousel from the responsiveness frames. It responds
 * to its own width and to how many tiles it holds. One tile simply fills
 * the content width, upright until 40rem and landscape beyond. Two or more
 * tiles ride a rail of fixed upright tiles on the 24px gutter, one dot per
 * tile, until two landscape tiles fit (58rem); from there the tiles share
 * the 1360px content width in two columns, and in three from 85.5rem, with
 * a dot per page. Each tile picks its own variant from the width it ends up
 * with. There are no arrows and no auto-rotation.
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
  // Page a dot is scrolling towards; while set, scroll events don't move
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
        text: text.status(target, pages, spv, first?.headline ?? ""),
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

  /** Bring a tile that receives focus fully onto its page, keeping the dots in step. */
  const onTrackFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const slide = (event.target as HTMLElement).closest("[aria-roledescription=slide]")
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

  // One tile is no carousel: it just fills the content width.
  if (count === 1) {
    return (
      <section aria-label={label} className={`${styles.root} py-6 font-noto text-ink`}>
        <div className={styles.single}>
          <div className={styles.slide}>
            <CollectionTile tile={items[0]} />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      data-measured={measured || undefined}
      // Lets the stylesheet drop the dots where this many tiles fit one page.
      data-count={count === 2 ? "two" : count === 3 ? "three" : "many"}
      className={`${styles.root} font-noto text-ink`}
    >
      {/* Rhythm from the frames: 24px above the tiles, 32px between them and
          the dots, 24px below. */}
      <div className="flex flex-col gap-8 py-6">
        {/* The dots precede the tiles in the DOM so they're reached first;
            CSS order places them below, as designed. They only exist when
            there is more than one page. */}
        {pageCount > 1 && (
          <div className={`${styles.controls} order-last flex items-center justify-center gap-4`}>
            <div role="group" aria-label={text.pages} className="flex items-center gap-4">
              {Array.from({ length: pageCount }, (_, position) => (
                <button
                  key={position}
                  type="button"
                  aria-label={
                    perView === 1
                      ? text.tile(position, pageCount, items[position]?.headline ?? "")
                      : text.page(position, pageCount)
                  }
                  aria-controls={trackId}
                  aria-current={position === page ? "true" : undefined}
                  onClick={() => goTo(position)}
                  className={`${styles.dot} relative size-2.5 rounded-full after:absolute after:-inset-2 after:content-['']`}
                />
              ))}
            </div>
          </div>
        )}

        <p role="status" aria-atomic="true" className="sr-only">
          {status.text}
          {status.seq % 2 === 1 ? " " : ""}
        </p>

        <div className={styles.runway}>
          <div
            ref={trackRef}
            id={trackId}
            role="group"
            aria-label={label}
            onFocusCapture={onTrackFocus}
            className={styles.track}
            style={{ "--count": count } as CSSProperties}
          >
            {/* A div rather than <article>: ARIA in HTML doesn't allow
                role="group" on an article. */}
            {items.map((item, position) => (
              <div
                key={item.slug}
                role="group"
                aria-roledescription="slide"
                aria-label={text.slide(position, count)}
                className={styles.slide}
              >
                <CollectionTile tile={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
