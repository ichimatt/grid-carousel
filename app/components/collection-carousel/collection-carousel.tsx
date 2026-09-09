"use client"

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type FocusEvent,
} from "react"
import styles from "./collection-carousel.module.css"
import { CollectionGraphic } from "./collection-graphics"
import { collections, type Collection } from "./collections"
import { getPositions, resolveIndex } from "../scroll-geometry"
import {
  ButtonChevronIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "./icons"

export type CollectionCarouselLabels = {
  /** aria-label for the previous-slide control. */
  previous?: string
  /** aria-label for the next-slide control. */
  next?: string
  /** aria-label for the rotation control while rotating. */
  stop?: string
  /** aria-label for the rotation control while stopped. */
  start?: string
  /** aria-label for the group of dots. */
  dots?: string
  /** aria-label for the scrollable list of slides, from the carousel's own name. */
  slides?: (label: string) => string
  /** aria-label for one dot, from its zero-based index, the count and the slide title. */
  dot?: (index: number, count: number, title: string) => string
  /** aria-label for one slide, from its zero-based index and the count. */
  slide?: (index: number, count: number) => string
  /** Screen-reader status after the slide changes. */
  status?: (index: number, count: number, title: string) => string
  /** Call-to-action text on every slide. */
  cta?: string
}

export type CollectionCarouselVariant = "default" | "mini"

export type CollectionCarouselProps = {
  items?: Collection[]
  /** Accessible name for the carousel region. */
  label?: string
  /** How long each slide is shown while auto-rotating, in milliseconds. */
  interval?: number
  /** Override the built-in English strings, e.g. for localisation. */
  labels?: CollectionCarouselLabels
  /**
   * "default" is the full card: one centred card, two from 36rem, and the
   * wide auto-rotating card from 64rem. "mini" is a rail of fixed-width
   * compact cards (graphic, title, course count) that sits on the gutter and
   * never takes the desktop treatment.
   */
  variant?: CollectionCarouselVariant
}

const defaultLabels = {
  previous: "Previous slide",
  next: "Next slide",
  stop: "Stop automatic rotation",
  start: "Start automatic rotation",
  dots: "Choose a slide",
  slides: (label: string) => `${label} slides`,
  dot: (index: number, count: number, title: string) =>
    `Go to slide ${index + 1} of ${count}: ${title}`,
  slide: (index: number, count: number) => `${index + 1} of ${count}`,
  status: (index: number, count: number, title: string) =>
    `Slide ${index + 1} of ${count}: ${title}`,
  cta: "Explore the collection",
} satisfies Required<CollectionCarouselLabels>

/** How long a control-initiated smooth scroll may take before the dots stop waiting for it. */
const SCROLL_SETTLE_MS = 1500
/** Debounce stand-in for `scrollend` in browsers that don't fire it (Safari). */
const SCROLL_IDLE_MS = 160

/**
 * Hi-fi course-collection carousel. It responds to its container rather than
 * the viewport. Below 64rem it is a card carousel driven by swipe and dots:
 * one fluid card centred with its neighbours peeking either side, and from
 * 36rem two cards side by side so a single card never gets stretched. From
 * 64rem it becomes one wide card with player controls that auto-rotates.
 *
 * Rotation follows the APG auto-rotating carousel pattern. It stops for good
 * (until the rotation control is pressed) when *keyboard* focus enters the
 * carousel or the user navigates manually — pointer focus is deliberately
 * ignored, so clicking a slide or the controls doesn't silently kill
 * rotation. It never starts by itself for users who prefer reduced motion
 * (they can opt in with the control), and it holds temporarily while the call
 * to action is hovered, while focus sits on a slide, or while the tab is
 * hidden.
 */
export default function CollectionCarousel({
  items = collections,
  label = "Course collections",
  interval = 6000,
  labels,
  variant = "default",
}: CollectionCarouselProps) {
  const mini = variant === "mini"
  const id = useId()
  const trackId = `${id}track`
  const text = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  const count = items.length

  const rootRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const indexRef = useRef(0)
  // Slide a control is scrolling towards; while set, scroll events don't move
  // the dots so they point at the destination, not each slide passed.
  const pendingRef = useRef<number | null>(null)
  const settleTimerRef = useRef(0)
  const idleTimerRef = useRef(0)
  const frameRef = useRef(0)
  // Focus that arrives during a pointer gesture is not keyboard navigation.
  const pointerFocusRef = useRef(false)
  const pointerResetRef = useRef(0)
  // Whether the movement now settling came from a swipe rather than a control.
  const swipeRef = useRef(false)
  const announcedRef = useRef(-1)

  const [index, setIndex] = useState(0)
  const [wide, setWide] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [ctaHovered, setCtaHovered] = useState(false)
  const [slideFocused, setSlideFocused] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  // seq forces a DOM mutation even when the same slide is announced twice.
  const [status, setStatus] = useState({ text: "", seq: 0 })

  const playing = wide && !stopped
  const progressPaused = ctaHovered || slideFocused || tabHidden

  const clearPending = useCallback(() => {
    pendingRef.current = null
    window.clearTimeout(settleTimerRef.current)
  }, [])

  const announce = useCallback(
    (position: number) => {
      announcedRef.current = position
      setStatus((previous) => ({
        text: text.status(position, count, items[position].title),
        seq: previous.seq + 1,
      }))
    },
    [count, items, text]
  )

  const sync = useCallback(
    (shouldAnnounce = false) => {
      const track = trackRef.current
      if (!track) return
      const positions = getPositions(track)
      const pending = pendingRef.current
      if (pending != null) {
        const target = Math.min(pending, positions.length - 1)
        if (Math.abs(track.scrollLeft - positions[target]) >= 2) return
        clearPending()
      }
      const next = resolveIndex(positions, track.scrollLeft, indexRef.current)
      if (next === indexRef.current) return
      indexRef.current = next
      setIndex(next)
      if (shouldAnnounce) announce(next)
    },
    [announce, clearPending]
  )

  const goTo = useCallback(
    (target: number, options: { announce?: boolean; jumpOnWrap?: boolean } = {}) => {
      const track = trackRef.current
      if (!track || count === 0) return
      const next = ((target % count) + count) % count
      // Stepping off either end would otherwise smooth-scroll back through
      // every slide, so wrap with an instant jump instead.
      const wraps = count > 2 && Math.abs(next - indexRef.current) === count - 1
      const jump = Boolean(options.jumpOnWrap) && wraps
      const positions = getPositions(track)
      const left = positions[Math.min(next, positions.length - 1)]

      clearPending()
      pendingRef.current = next
      indexRef.current = next
      setIndex(next)
      if (options.announce) announce(next)
      swipeRef.current = false
      // A cancelled smooth scroll (e.g. focus moving into the track) never
      // reaches the destination, so don't wait for it forever.
      settleTimerRef.current = window.setTimeout(() => {
        pendingRef.current = null
        sync()
      }, SCROLL_SETTLE_MS)

      if (!jump) {
        // The track's CSS scroll-behavior decides, so prefers-reduced-motion
        // users get an instant jump.
        track.scrollTo({ left })
        return
      }
      // Land the in-flight smooth scroll first: its residual delta would
      // otherwise be applied after the jump and leave the track off-snap.
      track.scrollTo({ left: track.scrollLeft, behavior: "instant" })
      track.scrollTo({ left, behavior: "instant" })
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        if (Math.abs(track.scrollLeft - left) > 1) {
          track.scrollTo({ left, behavior: "instant" })
        }
      })
    },
    [announce, clearPending, count, sync]
  )

  /** Manual navigation takes over from auto-rotation. */
  const navigate = (target: number, options: { jumpOnWrap?: boolean } = {}) => {
    setStopped(true)
    goTo(target, { announce: true, ...options })
  }

  // Read the container-query flag that says whether this instance is wide
  // enough to auto-rotate, start stopped for reduced-motion users, and keep
  // the current slide aligned across resizes.
  useLayoutEffect(() => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const measure = () => {
      setWide(!mini && getComputedStyle(stage).getPropertyValue("--wide").trim() === "1")
    }
    measure()

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onMotion = () => {
      if (motion.matches) setStopped(true)
    }
    onMotion()
    motion.addEventListener("change", onMotion)

    let width = track.clientWidth
    const observer = new ResizeObserver(() => {
      measure()
      if (track.clientWidth === width) return
      width = track.clientWidth
      clearPending()
      const positions = getPositions(track)
      track.scrollTo({
        left: positions[Math.min(indexRef.current, positions.length - 1)],
        behavior: "instant",
      })
    })
    observer.observe(track)

    return () => {
      observer.disconnect()
      motion.removeEventListener("change", onMotion)
    }
  }, [clearPending, mini])

  // Follow swipes and native scrolling. The dots track the finger, but only a
  // settled scroll is announced, so a fling or an abandoned drag doesn't read
  // out every slide it passes.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    sync()

    const settle = () => {
      clearPending()
      const wasSwipe = swipeRef.current
      swipeRef.current = false
      sync()
      // The dots follow the finger, so by now the index usually matches
      // already; announce the slide the swipe actually landed on.
      if (wasSwipe && indexRef.current !== announcedRef.current) {
        announce(indexRef.current)
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
  }, [sync, announce, clearPending, count])

  useEffect(() => {
    const frames = frameRef
    const pointerReset = pointerResetRef
    return () => {
      cancelAnimationFrame(frames.current)
      window.clearTimeout(pointerReset.current)
    }
  }, [])

  // Don't burn through slides in a background tab.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  /** Mark the focus that a pointer gesture is about to move, so it isn't read as keyboard entry. */
  const onPointerDownCapture = () => {
    pointerFocusRef.current = true
    window.clearTimeout(pointerResetRef.current)
    // The focus lands synchronously inside the gesture, well before this runs.
    pointerResetRef.current = window.setTimeout(() => {
      pointerFocusRef.current = false
    }, 0)
  }

  const onFocusCapture = (event: FocusEvent<HTMLElement>) => {
    // A pointer gesture also moves focus (the track is focusable), but a mouse
    // user has no focus ring to strand and hasn't asked rotation to stop.
    if (pointerFocusRef.current) return
    const track = trackRef.current
    if (track && event.target instanceof Node && track.contains(event.target)) {
      // Keyboard focus is on a slide: hold the timer so the slide can't scroll
      // out from under the focused element (WCAG 2.4.11).
      setSlideFocused(true)
    }
    const from = event.relatedTarget
    if (from instanceof Node && rootRef.current?.contains(from)) return
    setStopped(true)
  }

  const onBlurCapture = (event: FocusEvent<HTMLElement>) => {
    const track = trackRef.current
    const to = event.relatedTarget
    if (!track) return
    if (!(to instanceof Node) || !track.contains(to)) setSlideFocused(false)
  }

  const onProgressEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) return
    goTo(indexRef.current + 1, { jumpOnWrap: true })
  }

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerDownCapture={onPointerDownCapture}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      className={`${styles.root} bg-sunken font-noto text-ink`}
      style={{ "--interval": `${interval}ms` } as CSSProperties}
    >
      <div
        ref={stageRef}
        className={`${styles.stage} flex flex-col pt-6 pb-8 ${
          mini ? "gap-8" : "gap-6 @5xl:items-center @5xl:px-6 @5xl:py-11"
        }`}
      >
        {/* The controls come before the slides in the DOM so the rotation
            control is reached before the rotating content (APG); within the
            cluster, DOM order matches the visual order from the design. */}
        <div
          className={`order-last flex items-center justify-center ${
            mini ? "" : "@5xl:w-full @5xl:max-w-[1360px] @5xl:justify-between @5xl:px-8"
          }`}
        >
          {!mini && (
          <div className="hidden items-center gap-3 @5xl:order-last @5xl:flex">
            <ControlButton
              label={text.previous}
              controls={trackId}
              onClick={() => navigate(index - 1, { jumpOnWrap: true })}
            >
              <ChevronLeftIcon />
            </ControlButton>
            <ControlButton
              label={playing ? text.stop : text.start}
              controls={trackId}
              // Functional update: a pointer gesture can re-render this button
              // between mousedown and click, so never read render-time state.
              onClick={() => setStopped((wasStopped) => !wasStopped)}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </ControlButton>
            <ControlButton
              label={text.next}
              controls={trackId}
              onClick={() => navigate(index + 1, { jumpOnWrap: true })}
            >
              <ChevronRightIcon />
            </ControlButton>
          </div>
          )}

          <div role="group" aria-label={text.dots} className="flex items-center gap-4">
            {items.map((item, position) => {
              const active = position === index
              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-label={text.dot(position, count, item.title)}
                  aria-controls={trackId}
                  aria-current={active ? "true" : undefined}
                  onClick={() => navigate(position)}
                  className={`${styles.dot} relative h-2.5 w-2.5 rounded-full bg-ink/25 transition-[width] duration-200 after:absolute after:-inset-2 after:content-[''] hover:bg-ink/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                    mini ? "" : "@5xl:aria-[current]:w-8"
                  }`}
                >
                  {/* On desktop the active dot is a pill whose fill is the
                      rotation timer; stopped, the fill simply stays full. */}
                  {active && (
                    <span
                      key={`${position}-${playing}`}
                      data-paused={progressPaused}
                      onAnimationEnd={playing ? onProgressEnd : undefined}
                      className={`${styles.fill} absolute inset-0 rounded-full bg-ink ${playing ? styles.progress : ""}`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <p role="status" aria-atomic="true" className="sr-only">
          {status.text}
          {/* Alternating marker: repeating the same slide still mutates the DOM. */}
          {status.seq % 2 === 1 ? " " : ""}
        </p>

        {/* Desktop: one card frames the whole track. Mobile: every slide is its own card. */}
        <div
          className={`w-full ${
            mini ? "" : "@5xl:max-w-[1360px] @5xl:rounded-lg @5xl:bg-white @5xl:p-1 @5xl:shadow-elevation-1"
          }`}
        >
          <div
            ref={trackRef}
            id={trackId}
            role="group"
            aria-label={text.slides(label)}
            tabIndex={0}
            // Default: padding is the peek, one card fills the content box and
            // is centre-snapped so the neighbours show on both sides, and
            // two-up switches to start-snapping on the 24px gutter. Mini:
            // fixed-width cards start-snapped on the gutter at every width.
            className={`${styles.track} -mb-2 flex gap-3 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              mini
                ? "px-6 scroll-px-6"
                : "px-7 scroll-px-7 @xl:px-6 @xl:scroll-px-6 @5xl:mb-0 @5xl:gap-0 @5xl:rounded-sm @5xl:px-0 @5xl:pb-0 @5xl:scroll-px-0"
            }`}
          >
            {items.map((item, position) =>
              mini ? (
                <MiniSlide key={item.slug} item={item} label={text.slide(position, count)} />
              ) : (
                <CollectionSlide
                  key={item.slug}
                  item={item}
                  label={text.slide(position, count)}
                  cta={text.cta}
                  onCtaHover={setCtaHovered}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ControlButton({
  label,
  controls,
  onClick,
  children,
}: {
  label: string
  controls: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-full bg-sunken text-ink-secondary transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      {children}
    </button>
  )
}

/**
 * The "mini" card: graphic, title and course count on a fixed 215px card.
 * With no call to action, the title is the link and it stretches over the
 * whole card, so the card is one tap target with one accessible name.
 */
function MiniSlide({ item, label }: { item: Collection; label: string }) {
  const theme = {
    "--theme-color": item.theme.color,
    "--theme-text": item.theme.text,
  } as CSSProperties

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      style={theme}
      className="w-[215px] shrink-0 snap-start rounded-lg bg-white p-1 shadow-elevation-1"
    >
      <div className="relative flex h-full flex-col gap-2 overflow-clip rounded-sm bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--theme-color)_10%,white),white_50%)] pb-4">
        <div className="flex items-center justify-center overflow-clip px-6 py-4">
          <div className="relative size-[135px] shrink-0 text-(--theme-color)">
            <div className="absolute inset-[-201.48%]">
              <CollectionGraphic
                name={item.graphic}
                className={`${styles.graphic} block size-full`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-4">
          <h3 className="text-base/6 font-semibold text-balance">
            <a
              href={item.href}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {item.title}
            </a>
          </h3>
          <p className="text-xs/4 text-(--theme-text)">{item.courseCount}</p>
        </div>
      </div>
    </article>
  )
}

function CollectionSlide({
  item,
  label,
  cta,
  onCtaHover,
}: {
  item: Collection
  label: string
  cta: string
  onCtaHover: (hovered: boolean) => void
}) {
  const titleId = useId()
  const theme = {
    "--theme-color": item.theme.color,
    "--theme-bg": item.theme.bg,
    "--theme-text": item.theme.text,
  } as CSSProperties

  return (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      style={theme}
      className="w-full shrink-0 snap-center rounded-lg bg-white p-1 shadow-elevation-1 @xl:w-[calc((100%_-_0.75rem)/2)] @xl:snap-start @5xl:w-full @5xl:rounded-none @5xl:bg-transparent @5xl:p-0 @5xl:shadow-none"
    >
      <div className="flex h-full flex-col gap-4 overflow-clip rounded-sm bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--theme-color)_10%,white),white_50%)] @5xl:h-96 @5xl:flex-row @5xl:items-center @5xl:gap-16 @5xl:pr-16 @5xl:bg-[linear-gradient(to_right,var(--theme-bg),white)]">
        {/* The graphic is drawn ~5x larger than its box so its hairlines run
            out across the whole hero area and are clipped by it. */}
        <div className="flex items-center justify-center overflow-clip px-6 py-4 @5xl:h-full @5xl:w-96 @5xl:shrink-0 @5xl:py-0">
          <div className="relative size-[135px] shrink-0 text-(--theme-color) @5xl:size-[270px]">
            <div className="absolute inset-[-201.48%]">
              <CollectionGraphic
                name={item.graphic}
                className={`${styles.graphic} block size-full`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 pb-6 @5xl:min-w-0 @5xl:max-w-xl @5xl:gap-8 @5xl:pb-0">
          <div className="flex flex-1 flex-col gap-2 px-6 @5xl:flex-none @5xl:gap-3">
            <p className="flex gap-2 text-sm/5 text-(--theme-text)">
              <span className="font-semibold">{item.kicker}</span>
              <span>{item.courseCount}</span>
            </p>
            <h3
              id={titleId}
              className="text-lg/6 font-semibold tracking-[-0.09px] text-balance @5xl:text-[37px]/12 @5xl:tracking-[-0.46px]"
            >
              {item.title}
            </h3>
            <p className="text-sm/5 text-balance @5xl:text-base/6">{item.blurb}</p>
          </div>
          <div className="px-5">
            <a
              href={item.href}
              aria-describedby={titleId}
              onPointerEnter={() => onCtaHover(true)}
              onPointerLeave={() => onCtaHover(false)}
              className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink pr-3 pl-6 text-sm/5 font-medium text-white transition-colors hover:bg-ink/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink @5xl:inline-flex @5xl:w-auto"
            >
              {cta}
              <ButtonChevronIcon />
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
