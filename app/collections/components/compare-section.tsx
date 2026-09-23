"use client"

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import type { CompareAttribute, SpringboardCourse } from "../types"
import ComparisonItem from "./comparison-item"
import Container from "./container"
import { focusRing } from "./focus-ring"

/**
 * A 1px `line` rule centred in the 32px gap to the left of a grid column.
 * Applied in both table rows so the rule runs through the whole column.
 */
const columnRule =
  "relative before:absolute before:inset-y-0 before:-left-4 before:w-px before:bg-line first:before:hidden"

/**
 * One attribute of one course (Figma "comparison-item-detail"): a themed
 * rule, the label and the value, inset 8px. Rendered as a dt/dd pair so the
 * desktop row and each mobile strip read as description lists.
 */
function AttributeDetail({
  course,
  attribute,
  colon = false,
  nameCourse = false,
  className = "",
}: {
  course: SpringboardCourse
  attribute: CompareAttribute
  /** The desktop table ends the label with a colon; the mobile cards don't. */
  colon?: boolean
  /**
   * Add the course to the term for assistive tech. The desktop row relies
   * on column alignment to pair values with courses; the mobile strips sit
   * inside a region already named after the course.
   */
  nameCourse?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-3 px-2 ${className}`}>
      <dt className="border-t border-(--theme-color) pt-3 text-sm/5 text-(--theme-text)">
        {attribute.label}
        {colon && ":"}
        {nameCourse && <span className="sr-only"> for {course.title}</span>}
      </dt>
      <dd className="text-sm/5 text-ink">
        {attribute.key === "price" ? (
          <>
            <p className="font-semibold">{course.compare.price}</p>
            <p>{course.compare.duration}</p>
          </>
        ) : (
          course.compare[attribute.key]
        )}
      </dd>
    </div>
  )
}

/**
 * The "Compare" section (Figma 910:14371 desktop, 910:10863 mobile).
 * Desktop: pill tabs pick one attribute, shown under all five courses at
 * once in a five-column table. Mobile: each course gets its own
 * horizontally scrolling strip of all four attributes, so no tabs.
 */
export default function CompareSection({
  title,
  intro,
  attributes,
  courses,
}: {
  title: string
  intro: string
  attributes: CompareAttribute[]
  courses: SpringboardCourse[]
}) {
  const baseId = useId()
  const headingId = `${baseId}-heading`
  const panelId = `${baseId}-panel`
  const tabId = (index: number) => `${baseId}-tab-${index}`

  const [activeIndex, setActiveIndex] = useState(0)
  const active = attributes[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tablistRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  // Counts the user's tab choices so the reveal below runs after each one,
  // once the chosen values are laid out, even when the choice is repeated.
  const [reveals, setReveals] = useState(0)

  // Selection follows focus, as in an APG automatic-activation tablist.
  const selectTab = (index: number) => {
    const next = (index + attributes.length) % attributes.length
    setActiveIndex(next)
    setReveals((count) => count + 1)
    // The reveal below does the scrolling, with the tabs kept in view.
    tabRefs.current[next]?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (reveals === 0) return
    const tablist = tablistRef.current
    const panel = panelRef.current
    if (!tablist || !panel) return
    // Only act when the values are not wholly in view. Then scroll just far
    // enough to show them under the tabs, never so far that the tabs slide
    // under the sticky header; if the values are above the viewport (the
    // page was scrolled with a tab still focused), bring the tabs back down.
    const gap = 16
    const headerHeight =
      parseFloat(getComputedStyle(panel).getPropertyValue("--header-h")) || 0
    const { top: panelTop, bottom: panelBottom } = panel.getBoundingClientRect()
    // A pixel of tolerance so sub-pixel layout never counts as hidden.
    if (panelTop >= headerHeight - 1 && panelBottom <= window.innerHeight + 1) return
    const room = tablist.getBoundingClientRect().top - headerHeight - gap
    const distance =
      panelTop < headerHeight
        ? room
        : Math.min(panelBottom + gap - window.innerHeight, Math.max(room, 0))
    if (Math.abs(distance) < 1) return
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollBy({ top: distance, behavior: reduceMotion ? "auto" : "smooth" })
  }, [reveals])

  const onTabKeyDown = (event: KeyboardEvent) => {
    const targets: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: attributes.length - 1,
    }
    if (event.key in targets) {
      event.preventDefault()
      selectTab(targets[event.key])
    }
  }

  // Browsers scroll a focused strip with the arrow keys already; Home and
  // End would otherwise jump the page instead of the strip.
  const onStripKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Home" && event.key !== "End") return
    event.preventDefault()
    const strip = event.currentTarget
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    strip.scrollTo({
      left: event.key === "Home" ? 0 : strip.scrollWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <section aria-labelledby={headingId}>
      <Container>
        <div className="border-t border-line pt-6 pb-8 lg:py-16">
          {/* Title row: the copy and, from lg, the tabs bottom-aligned on
              its right. Between lg and the width where both fit, the tabs
              wrap onto their own line and stay right-aligned. */}
          <div className="flex flex-col gap-6 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-2 lg:gap-y-4">
            <div className="flex flex-col gap-6 lg:gap-0 lg:pb-1">
              <h2
                id={headingId}
                className="max-w-[304px] text-[23px]/8 font-semibold tracking-[-0.17px] text-balance lg:max-w-none"
              >
                {title}
              </h2>
              <p className="text-base/6">{intro}</p>
            </div>

            <div
              ref={tablistRef}
              role="tablist"
              aria-label="Compare by"
              onKeyDown={onTabKeyDown}
              className="hidden gap-1 lg:ml-auto lg:flex"
            >
              {attributes.map((attribute, index) => {
                const selected = index === activeIndex
                return (
                  <button
                    key={attribute.key}
                    ref={(el) => {
                      tabRefs.current[index] = el
                    }}
                    type="button"
                    role="tab"
                    id={tabId(index)}
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectTab(index)}
                    className={`h-8 rounded-full px-4 text-sm/5 font-medium whitespace-nowrap transition-colors ${focusRing} ${
                      selected
                        ? "bg-(--theme-text) text-white"
                        : "text-(--theme-text) hover:bg-(--theme-bg)"
                    }`}
                  >
                    {attribute.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop table: two grids with the same five columns so the
              course row stretches to its tallest item and the value row
              lines up under it. */}
          <div className="mt-8 hidden lg:block">
            {/* role="list" keeps list semantics in Safari once list-style is removed. */}
            <ul role="list" className="grid grid-cols-5 gap-x-8">
              {courses.map((course) => (
                <li key={course.slug} className={`flex pb-2 ${columnRule}`}>
                  <ComparisonItem course={course} className="flex-1" />
                </li>
              ))}
            </ul>
            {/* tabIndex: the panel holds plain text, so it takes focus itself (APG tabs). */}
            <div
              ref={panelRef}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId(activeIndex)}
              tabIndex={0}
              className={`rounded-xs ${focusRing}`}
            >
              {/* Every attribute is laid out in every column, stacked on one
                  grid cell, so the row is always as tall as its tallest state
                  and switching tabs never moves the page. Only the chosen
                  attribute is visible, and only it reaches assistive tech. */}
              <div className="grid grid-cols-5 gap-x-8">
                {courses.map((course) => (
                  <dl key={course.slug} className={`grid ${columnRule}`}>
                    {attributes.map((attribute) => (
                      <AttributeDetail
                        key={attribute.key}
                        course={course}
                        attribute={attribute}
                        colon
                        nameCourse
                        className={`col-start-1 row-start-1 ${
                          attribute.key === active.key ? "" : "invisible"
                        }`}
                      />
                    ))}
                  </dl>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: one block per course bleeding to the viewport edges so
              the attribute strip can run under the right-hand gutter. */}
          <ul role="list" className="-mx-6 mt-6 flex flex-col gap-3 py-3 lg:hidden">
            {courses.map((course) => (
              <li key={course.slug} className="flex flex-col gap-3">
                <div className="mx-6 border-t border-line" />
                <div className="flex flex-col gap-3 bg-white px-5 pb-8">
                  <ComparisonItem course={course} orientation="horizontal" />
                  <div className="relative -mr-5">
                    {/* The strip is a focusable region so keyboard users can
                        scroll it; the scrollbar is hidden since the peeking
                        next card already signals more content. */}
                    <div
                      role="region"
                      tabIndex={0}
                      aria-label={`${course.title} comparison`}
                      onKeyDown={onStripKeyDown}
                      // Inset ring: the strip runs to the viewport edge, so an
                      // outer ring would be cut off on the right. The vertical
                      // slack keeps the ring off the cards' rule and descenders,
                      // and z-10 lifts it above the fade while focused.
                      className={`relative -my-1 py-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:z-10 [&::-webkit-scrollbar]:hidden ${focusRing} focus-visible:ring-inset`}
                    >
                      {/* Cards are the block's content width minus a 31px
                          peek of the next card (289px at 360): the list's
                          pr-5 mirrors the bleed so the percentage resolves
                          against 320, not the scroller's 340. The ::after
                          spacer keeps the last card 20px off the edge when
                          fully scrolled, since padding is not counted as
                          scrollable overflow here. */}
                      <dl className="flex gap-3 pr-5 after:w-2 after:shrink-0 after:content-['']">
                        {attributes.map((attribute) => (
                          <AttributeDetail
                            key={attribute.key}
                            course={course}
                            attribute={attribute}
                            className="w-[calc(100%-31px)] shrink-0 snap-start"
                          />
                        ))}
                      </dl>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-linear-to-r from-transparent to-white to-70%" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
