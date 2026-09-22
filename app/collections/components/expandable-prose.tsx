"use client"

import { useEffect, useId, useRef, useState } from "react"
import { focusRing } from "./focus-ring"

/** Lines of the first paragraph kept while collapsed (Figma 910:10856). */
const LINES = 5

/**
 * Body copy that shows every paragraph on desktop but collapses below lg to
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

  const clamped = !expanded && overflows
  const toggle = (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={id}
      aria-label={expanded ? "Show less" : "Show more"}
      onClick={() => setExpanded((open) => !open)}
      className={`rounded-xs text-link-subtle hover:underline lg:hidden ${focusRing}`}
    >
      {expanded ? "less" : "more"}
    </button>
  )

  return (
    <div className="relative max-w-[672px] text-base/6 text-ink">
      <div
        ref={boxRef}
        id={id}
        className={clamped ? "line-clamp-5 lg:line-clamp-none" : ""}
      >
        <p>
          {first}
          {!expanded && !overflows && <> {toggle}</>}
        </p>
        {rest.map((paragraph, index) => (
          <p
            key={paragraph}
            className={`mt-4 ${expanded ? "" : "hidden lg:block"}`}
          >
            {paragraph}
            {expanded && index === rest.length - 1 && <> {toggle}</>}
          </p>
        ))}
      </div>
      {clamped && (
        // Pinned over the end of the fifth line; the fade hides the glyphs
        // the browser's own ellipsis would otherwise leave beside it.
        <p className="absolute right-0 bottom-0 bg-white pl-2 before:absolute before:inset-y-0 before:right-full before:w-10 before:bg-linear-to-r before:from-transparent before:to-white lg:hidden">
          <span aria-hidden="true">… </span>
          {toggle}
        </p>
      )}
    </div>
  )
}
