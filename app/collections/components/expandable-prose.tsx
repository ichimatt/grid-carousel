"use client"

import { useEffect, useId, useRef, useState } from "react"
import { focusRing } from "./focus-ring"

/** Lines of the first paragraph kept while collapsed (Figma 910:10856). */
const LINES = 5

/**
 * Body copy that shows every paragraph on desktop but collapses below it to
 * the first paragraph ending in "… more". When that paragraph runs past
 * five lines it is clamped by the browser (so the cut is always on a line
 * boundary) and the toggle sits over the end of the last line behind a
 * fade; when it fits, as it does on tablets, the toggle simply follows the
 * sentence in flow. The clipped tail of the first paragraph stays in the
 * accessibility tree; the later paragraphs are display:none until expanded.
 */
export default function ExpandableProse({ paragraphs }: { paragraphs: string[] }) {
  const [expanded, setExpanded] = useState(false)
  // Assume the phone case (a long first paragraph) until measured, so the
  // server render matches the designed mobile state.
  const [overflows, setOverflows] = useState(true)
  const id = useId()
  const boxRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  // True between a toggle press and the render that follows it.
  const toggledRef = useRef(false)
  const [first, ...rest] = paragraphs

  useEffect(() => {
    const box = boxRef.current
    const paragraph = box?.firstElementChild
    if (!box || !(paragraph instanceof HTMLElement)) return
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight)
      // scrollHeight is the paragraph's full height whether or not the
      // clamp is currently applied.
      setOverflows(paragraph.scrollHeight > lineHeight * LINES + 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  // The toggle moves between the clamped overlay, the first paragraph and
  // the last one, so React remounts it; put focus back on it afterwards.
  useEffect(() => {
    if (!toggledRef.current) return
    toggledRef.current = false
    toggleRef.current?.focus({ preventScroll: true })
  }, [expanded])

  const clamped = !expanded && overflows
  const toggle = (
    <button
      ref={toggleRef}
      type="button"
      aria-expanded={expanded}
      aria-controls={id}
      aria-label={expanded ? "Show less" : "Show more"}
      onClick={() => {
        toggledRef.current = true
        setExpanded((open) => !open)
      }}
      className={`rounded-xs text-link-subtle hover:underline desktop:hidden ${focusRing}`}
    >
      {expanded ? "less" : "more"}
    </button>
  )

  return (
    <div className="relative max-w-[672px] text-base/6 text-ink">
      <div
        ref={boxRef}
        id={id}
        className={clamped ? "line-clamp-5 desktop:line-clamp-none" : ""}
      >
        <p>
          {first}
          {!expanded && !overflows && <> {toggle}</>}
        </p>
        {rest.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`mt-4 ${expanded ? "" : "hidden desktop:block"}`}
          >
            {paragraph}
            {expanded && index === rest.length - 1 && <> {toggle}</>}
          </p>
        ))}
      </div>
      {clamped && (
        // Pinned over the end of the fifth line; the fade hides the glyphs
        // the browser's own ellipsis would otherwise leave beside it.
        <p className="absolute right-0 bottom-0 bg-white pl-2 before:absolute before:inset-y-0 before:right-full before:w-10 before:bg-linear-to-r before:from-transparent before:to-white desktop:hidden">
          <span aria-hidden="true">… </span>
          {toggle}
        </p>
      )}
    </div>
  )
}
