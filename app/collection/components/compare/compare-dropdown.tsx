"use client"

import { useId, useState } from "react"
import { compareAttributes, courses, type CompareAttribute } from "../../data"
import { AttributeValue, ChevronDown, CourseHeading, StageBand } from "./shared"
import { useStuck } from "./use-stuck"

/**
 * Prototype 1 — a sticky bar under the fixed header holds a dropdown that
 * picks which attribute every course below is showing.
 */
export default function CompareDropdown() {
  const selectId = useId()
  const [key, setKey] = useState<CompareAttribute["key"]>("chooseWhen")
  const attribute = compareAttributes.find((a) => a.key === key)!
  const { sentinelRef, stuck } = useStuck()

  return (
    <div className="lg:hidden">
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={`sticky top-(--header-h) z-30 -mx-1 bg-white px-1 py-3 transition-shadow ${
          stuck ? "shadow-[0_8px_10px_-8px_rgba(80,86,199,0.45)]" : ""
        }`}
      >
        <div className="flex h-12 items-stretch border border-wf">
          <label
            htmlFor={selectId}
            className="flex shrink-0 items-center pl-4 pr-3 text-sm/[26px]"
          >
            Compare:
          </label>
          <div className="relative flex-1">
            <select
              id={selectId}
              value={key}
              onChange={(event) =>
                setKey(event.target.value as CompareAttribute["key"])
              }
              className="size-full appearance-none rounded-none bg-transparent pr-10 text-sm font-bold text-wf focus:outline-none focus-visible:bg-wf/14"
            >
              {compareAttributes.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <ul className="mt-2">
        {courses.map((course) => (
          <li
            key={course.slug}
            className="border-b border-wf/40 pb-6 pt-4 first:pt-2 last:border-b-0"
          >
            <StageBand>{course.stage}</StageBand>
            <CourseHeading course={course} />
            <p className="mt-3 text-sm/[26px] font-bold">{attribute.label}</p>
            <AttributeValue course={course} attribute={attribute} />
          </li>
        ))}
      </ul>
    </div>
  )
}
