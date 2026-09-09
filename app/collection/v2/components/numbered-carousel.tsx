"use client"

import {
  Children,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { NumberedCircle } from "./ui"

/**
 * Mobile treatment of the numbered lists in the version-ii wireframe: a
 * peeking scroll-snap carousel, one slide per view, with the list's own
 * numbered circles doubling as the page indicators. A simplified sibling of
 * the shared Carousel component, which places dots-and-arrows below the
 * slides instead.
 */
export default function NumberedCarousel({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const id = useId()
  const trackId = `${id}track`
  const slideCount = Children.count(children)

  const trackRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef(0)
  // Slide a circle click is scrolling towards; while set, scroll events don't
  // move the indicator so it points at the destination.
  const pendingRef = useRef<number | null>(null)
  const [active, setActive] = useState(0)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const positions = getPositions(track)
    const pending = pendingRef.current
    if (pending != null) {
      const target = Math.min(pending, positions.length - 1)
      if (Math.abs(track.scrollLeft - positions[target]) >= 2) return
      pendingRef.current = null
    }
    let nearest = 0
    for (let i = 1; i < positions.length; i++) {
      if (
        Math.abs(positions[i] - track.scrollLeft) <
        Math.abs(positions[nearest] - track.scrollLeft)
      ) {
        nearest = i
      }
    }
    activeRef.current = nearest
    setActive(nearest)
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
    const observer = new ResizeObserver(() => {
      // Keep the slide the user was looking at aligned across resizes.
      const positions = getPositions(track)
      const target = Math.min(activeRef.current, positions.length - 1)
      track.scrollTo({ left: positions[target], behavior: "instant" })
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

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const positions = getPositions(track)
    const target = Math.max(0, Math.min(index, positions.length - 1))
    pendingRef.current = target
    activeRef.current = target
    setActive(target)
    // No behavior option: the track's CSS scroll-behavior decides, so
    // prefers-reduced-motion users get an instant jump.
    track.scrollTo({ left: positions[target] })
  }

  return (
    <section aria-roledescription="carousel" aria-label={label} className="mt-7">
      <div role="group" aria-label={`${label} pages`} className="flex flex-wrap gap-3.5">
        {Array.from({ length: slideCount }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Item ${index + 1} of ${slideCount}`}
            aria-controls={trackId}
            aria-current={index === active ? "true" : undefined}
            onClick={() => goTo(index)}
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wf"
          >
            <NumberedCircle number={index + 1} active={index === active} />
          </button>
        ))}
      </div>
      <div
        ref={trackRef}
        id={trackId}
        role="group"
        aria-label={label}
        tabIndex={0}
        className="-mx-7 mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-7 pb-1 scroll-px-7 [scrollbar-width:none] motion-reduce:scroll-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wf [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child, index) => (
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideCount}`}
            className="w-[calc(100%-1rem)] shrink-0 snap-start"
          >
            {child}
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Snap position of every slide, from live geometry (the shared Carousel's
 * approach, without the multi-slide page maths).
 */
function getPositions(track: HTMLElement): number[] {
  const slides = Array.from(track.children)
  if (slides.length === 0) return [0]
  const maxScroll = track.scrollWidth - track.clientWidth
  const origin = slides[0].getBoundingClientRect().left
  return slides.map((slide) =>
    Math.min(maxScroll, Math.max(0, slide.getBoundingClientRect().left - origin))
  )
}
