"use client"

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import styles from "./carousel.module.css"

export type CarouselLabels = {
  /** aria-label for the previous-page arrow. */
  previous?: string
  /** aria-label for the next-page arrow. */
  next?: string
  /** aria-label for the group of page dots. */
  pages?: string
  /** aria-label for one page dot, from its zero-based index and the page count. */
  page?: (index: number, count: number) => string
  /** aria-label for one slide, from its zero-based index and the slide count. */
  slide?: (index: number, count: number) => string
}

export type CarouselProps = {
  /** Accessible name announced for the carousel region. */
  label: string
  /** Each direct child is rendered as one slide. */
  children: ReactNode
  /**
   * How many slides are fully visible, keyed by minimum carousel width in px
   * (the carousel's own width, not the viewport). Below the smallest key one
   * slide is shown. Arrows and dots always advance by one full set.
   */
  slidesPerView?: Record<number, number>
  /** Visible sliver of the neighbouring page's slide at each edge. Any CSS length. */
  peek?: string
  /**
   * Gap between slides. Any CSS length. Defaults to the app's global
   * --grid-gutter token, falling back to 1rem where it isn't defined.
   */
  gap?: string
  /**
   * Hang the peek zones outside the carousel's own box instead of insetting
   * the slides, so resting slides align exactly with surrounding content.
   * The surrounding layout must reserve at least peek + gap of clear space
   * on each side (e.g. page padding) for the peeking slides to render into.
   */
  bleed?: boolean
  /** Override the built-in English control labels, e.g. for localisation. */
  labels?: CarouselLabels
  /**
   * Also the place to theme the carousel: controls inherit currentColor, and
   * setting --carousel-fade to the page background fades out the peek zones.
   */
  className?: string
}

const defaultLabels = {
  previous: "Previous page",
  next: "Next page",
  pages: "Carousel pages",
  page: (index: number, count: number) => `Page ${index + 1} of ${count}`,
  slide: (index: number, count: number) => `Slide ${index + 1} of ${count}`,
} satisfies Required<CarouselLabels>

function normalizeBreakpoints(config: Record<number, number>): [number, number][] {
  const entries = Object.entries(config)
    .map(([width, count]) => [Number(width), Math.floor(Number(count))] as [number, number])
    .filter(([width, count]) => Number.isFinite(width) && width >= 0 && count >= 1)
    .sort((a, b) => a[0] - b[0])
  return entries.length > 0 ? entries : [[0, 1]]
}

type Layout = {
  perView: number
  /** Snap position (scrollLeft value) of every slide. */
  slidePositions: number[]
  /** Snap position of the first slide of each page. */
  pagePositions: number[]
}

/**
 * Derived from live geometry so it stays correct across breakpoints, RTL,
 * and a trailing page with fewer slides than a full set.
 */
function getLayout(track: HTMLElement): Layout {
  const slides = Array.from(track.children)
  const trackStyle = getComputedStyle(track)
  const perView = Math.max(1, Math.round(parseFloat(trackStyle.getPropertyValue("--spv"))) || 1)
  if (slides.length === 0) return { perView, slidePositions: [0], pagePositions: [0] }
  const maxScroll = track.scrollWidth - track.clientWidth
  const [min, max] = trackStyle.direction === "rtl" ? [-maxScroll, 0] : [0, maxScroll]
  const origin = slides[0].getBoundingClientRect().left
  const slidePositions = slides.map((slide) =>
    Math.min(max, Math.max(min, slide.getBoundingClientRect().left - origin))
  )
  const pagePositions: number[] = []
  for (let i = 0; i < slidePositions.length; i += perView) {
    const target = slidePositions[i]
    if (pagePositions.length === 0 || Math.abs(target - pagePositions[pagePositions.length - 1]) > 1) {
      pagePositions.push(target)
    }
  }
  return { perView, slidePositions, pagePositions }
}

function nearestIndex(positions: number[], scrollLeft: number): number {
  let nearest = 0
  for (let i = 1; i < positions.length; i++) {
    if (Math.abs(positions[i] - scrollLeft) < Math.abs(positions[nearest] - scrollLeft)) {
      nearest = i
    }
  }
  return nearest
}

export default function Carousel({
  label,
  children,
  slidesPerView = { 0: 1, 640: 2, 1024: 3 },
  peek = "1.25rem",
  gap = "var(--grid-gutter, 1rem)",
  bleed = false,
  labels,
  className,
}: CarouselProps) {
  const id = useId()
  const trackId = `${id}track`
  const text = { ...defaultLabels, ...labels }
  const slideCount = Children.count(children)
  const breakpoints = normalizeBreakpoints(slidesPerView)
  const baseSlidesPerView = breakpoints[0][0] === 0 ? breakpoints[0][1] : 1

  const trackRef = useRef<HTMLDivElement | null>(null)
  const pageRef = useRef(0)
  // Page a button click is scrolling towards; while set, scroll events don't
  // move the dots so they point at the destination, not each page passed.
  const pendingRef = useRef<number | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(() =>
    Math.max(1, Math.ceil(slideCount / baseSlidesPerView))
  )

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { pagePositions } = getLayout(track)
    setPageCount(pagePositions.length)
    const pending = pendingRef.current
    if (pending != null) {
      const target = Math.min(pending, pagePositions.length - 1)
      if (Math.abs(track.scrollLeft - pagePositions[target]) >= 2) return
      pendingRef.current = null
    }
    const current = nearestIndex(pagePositions, track.scrollLeft)
    pageRef.current = current
    setPage(current)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    sync()

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }
    const releasePending = () => {
      pendingRef.current = null
    }

    let width = track.clientWidth
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === width) return
      width = track.clientWidth
      pendingRef.current = null
      // Keep the slide the user was looking at in view, re-aligned to the
      // start of whichever page it belongs to in the new layout.
      const { perView, slidePositions, pagePositions } = getLayout(track)
      const nearestSlide = nearestIndex(slidePositions, track.scrollLeft)
      const target = Math.min(Math.floor(nearestSlide / perView), pagePositions.length - 1)
      track.scrollTo({ left: pagePositions[target], behavior: "instant" })
      pageRef.current = target
      setPageCount(pagePositions.length)
      setPage(target)
    })

    track.addEventListener("scroll", onScroll, { passive: true })
    track.addEventListener("pointerdown", releasePending, { passive: true })
    track.addEventListener("wheel", releasePending, { passive: true })
    track.addEventListener("keydown", releasePending)
    observer.observe(track)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", onScroll)
      track.removeEventListener("pointerdown", releasePending)
      track.removeEventListener("wheel", releasePending)
      track.removeEventListener("keydown", releasePending)
      observer.disconnect()
    }
  }, [sync, slideCount])

  const goTo = useCallback((target: number) => {
    const track = trackRef.current
    if (!track) return
    const { pagePositions } = getLayout(track)
    const clamped = Math.max(0, Math.min(target, pagePositions.length - 1))
    pendingRef.current = clamped
    pageRef.current = clamped
    setPageCount(pagePositions.length)
    setPage(clamped)
    // No behavior option: the track's CSS scroll-behavior decides, so
    // prefers-reduced-motion users get an instant jump.
    track.scrollTo({ left: pagePositions[clamped] })
  }, [])

  const spvCss = breakpoints
    .map(([minWidth, count]) =>
      minWidth === 0
        ? `[data-carousel="${id}"]{--spv:${count}}`
        : `@container (min-width:${minWidth}px){[data-carousel="${id}"]{--spv:${count}}}`
    )
    .join("")

  return (
    <section
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ "--peek": peek, "--gap": gap } as CSSProperties}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <style href={`carousel-${id}-${breakpoints.flat().join("-")}`} precedence="default">
        {spvCss}
      </style>
      <div className={bleed ? `${styles.frame} ${styles.bleed}` : styles.frame}>
        <div
          ref={trackRef}
          id={trackId}
          data-carousel={id}
          className={styles.track}
          role="group"
          aria-label={label}
          tabIndex={0}
        >
          {Children.map(children, (child, index) => (
            <div
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={text.slide(index, slideCount)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          aria-label={text.previous}
          aria-controls={trackId}
          aria-disabled={page === 0}
          onClick={() => {
            if (page > 0) goTo(page - 1)
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m10 3.5-4.5 4.5 4.5 4.5" />
          </svg>
        </button>
        <div className={styles.dots} role="group" aria-label={text.pages}>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              className={styles.dot}
              aria-label={text.page(index, pageCount)}
              aria-controls={trackId}
              aria-current={index === page ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.arrow}
          aria-label={text.next}
          aria-controls={trackId}
          aria-disabled={page >= pageCount - 1}
          onClick={() => {
            if (page < pageCount - 1) goTo(page + 1)
          }}
        >
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" />
          </svg>
        </button>
      </div>
    </section>
  )
}
