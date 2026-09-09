"use client"

import { useId, useRef, useState } from "react"
import { compareAttributes, courses } from "../../data"
import { AttributeValue, CourseHeading, StageBand } from "./shared"
import { useStuck } from "./use-stuck"

/**
 * Prototype 2 — a sticky bar under the fixed header holds horizontally
 * scrollable tabs that pick which attribute every course below is showing.
 */
export default function CompareTabs() {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const attribute = compareAttributes[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { sentinelRef, stuck } = useStuck()

  const panelId = `${baseId}panel`
  const tabId = (index: number) => `${baseId}tab-${index}`

  const selectTab = (index: number) => {
    const next = (index + compareAttributes.length) % compareAttributes.length
    setActiveIndex(next)
    const tab = tabRefs.current[next]
    tab?.focus()
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const handlers: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: compareAttributes.length - 1,
    }
    if (event.key in handlers) {
      event.preventDefault()
      selectTab(handlers[event.key])
    }
  }

  return (
    <div className="lg:hidden">
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={`sticky top-(--header-h) z-30 bg-white pt-2 transition-shadow ${
          stuck ? "shadow-[0_8px_10px_-8px_rgba(80,86,199,0.45)]" : ""
        }`}
      >
        <p className="text-sm/[26px]">Compare:</p>
        <div
          role="tablist"
          aria-label="Compare courses by"
          onKeyDown={onKeyDown}
          className="-mx-7 mt-1 flex overflow-x-auto border-y border-wf px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {compareAttributes.map((option, index) => (
            <button
              key={option.key}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={tabId(index)}
              aria-selected={index === activeIndex}
              aria-controls={panelId}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => selectTab(index)}
              className="shrink-0 py-[9px] pr-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-wf"
            >
              <span
                className={`whitespace-nowrap px-2 text-sm/[24px] font-bold ${
                  index === activeIndex ? "bg-wf text-white" : "text-wf"
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={tabId(activeIndex)}>
        <ul>
          {courses.map((course) => (
            <li
              key={course.slug}
              className="border-b border-wf/40 pb-6 pt-4 first:pt-3 last:border-b-0"
            >
              <StageBand>{course.stage}</StageBand>
              <CourseHeading course={course} />
              <p className="mt-3 text-sm/[26px] font-bold">{attribute.label}</p>
              <AttributeValue course={course} attribute={attribute} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
