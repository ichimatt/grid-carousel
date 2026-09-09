"use client"

import Image from "next/image"
import { useId, useRef, useState } from "react"
import Container from "../../components/container"
import { AttributeValue, CourseHeading } from "../../components/compare/shared"
import { compareSection, courses, type Course } from "../../data"
import { compareAttributes, mobileCompareAttributes } from "../data"
import { SectionHeading } from "./ui"

/**
 * Desktop: a "Compare:" bar picks one attribute, shown across all five
 * course columns at once.
 */
function DesktopCompare() {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const attribute = compareAttributes[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const panelId = `${baseId}panel`
  const tabId = (index: number) => `${baseId}tab-${index}`

  const selectTab = (index: number) => {
    const next = (index + compareAttributes.length) % compareAttributes.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
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
    <div className="hidden lg:block">
      <div className="mt-8 flex items-center justify-between gap-6 border-y border-wf/40 py-3.5">
        <p className="text-sm/[26px]">Compare:</p>
        <div
          role="tablist"
          aria-label="Compare courses by"
          onKeyDown={onKeyDown}
          className="flex gap-x-4"
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
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wf"
            >
              <span
                className={`whitespace-nowrap px-2 text-sm/[26px] font-bold ${
                  index === activeIndex ? "bg-wf text-white" : ""
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Images, headings, and values flow as three grid rows (the course-
          cards trick), so each row takes the tallest column's height and the
          dividers and attribute values align across courses. */}
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(activeIndex)}
        className="mt-8 grid grid-cols-5 gap-x-10"
      >
        {courses.map((course) => (
          <div
            key={`image-${course.slug}`}
            className="relative aspect-[425/234] overflow-clip rounded-lg bg-wf"
          >
            <Image
              src={course.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 224px, 56px"
              className="object-cover mix-blend-luminosity"
            />
          </div>
        ))}
        {/* text-balance inherits into the shared CourseHeading/AttributeValue
            paragraphs, evening out their short wrapped lines. */}
        {courses.map((course) => (
          <div key={`heading-${course.slug}`} className="text-balance">
            <CourseHeading course={course} />
          </div>
        ))}
        {courses.map((course) => (
          <div
            key={`value-${course.slug}`}
            className="mt-4 border-t border-wf/40 pt-3 text-balance"
          >
            <p className="text-sm/[26px] font-bold">{attribute.label}</p>
            <AttributeValue course={course} attribute={attribute} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Mobile: one card per course with price and duration in a fixed row, and
 * tabs for the narrative attributes. Each card's tabs switch independently.
 */
function MobileCompareCard({ course }: { course: Course }) {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const attribute = mobileCompareAttributes[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const panelId = `${baseId}panel`
  const tabId = (index: number) => `${baseId}tab-${index}`

  const selectTab = (index: number) => {
    const next =
      (index + mobileCompareAttributes.length) % mobileCompareAttributes.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const handlers: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: mobileCompareAttributes.length - 1,
    }
    if (event.key in handlers) {
      event.preventDefault()
      selectTab(handlers[event.key])
    }
  }

  return (
    <li className="overflow-clip rounded-lg border border-wf bg-white">
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="relative size-14 shrink-0 overflow-clip rounded bg-wf">
          <Image
            src={course.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover mix-blend-luminosity"
          />
        </div>
        <div>
          <h3 className="text-balance text-base/[22px] font-bold">
            <a
              href="#"
              className="underline decoration-solid decoration-from-font [text-underline-position:from-font]"
            >
              {course.title}
            </a>
          </h3>
          <p className="mt-1 text-sm/[21px]">{course.provider}</p>
        </div>
      </div>

      <p className="flex justify-between gap-4 border-t border-wf/40 px-4 py-2 text-sm/[26px]">
        <span>
          <strong>{course.duration}</strong> starting{" "}
          <strong>{course.startDate}</strong>
        </span>
        <strong>{course.price}</strong>
      </p>

      <div
        role="tablist"
        aria-label={`Compare ${course.title} by`}
        onKeyDown={onKeyDown}
        className="flex bg-wf/14"
      >
        {mobileCompareAttributes.map((option, index) => (
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
            className={`border-b-2 px-3 py-2 text-sm/[24px] font-bold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-wf ${
              index === activeIndex
                ? "border-wf bg-white"
                : "border-transparent"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* tabIndex: the panel holds plain text, so it takes focus itself (APG tabs). */}
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(activeIndex)}
        tabIndex={0}
        className="p-4 text-balance"
      >
        <AttributeValue course={course} attribute={attribute} />
      </div>
    </li>
  )
}

function MobileCompare() {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {courses.map((course) => (
        <MobileCompareCard key={course.slug} course={course} />
      ))}
    </ul>
  )
}

export default function CompareCourses() {
  return (
    <section className="mt-12 scroll-mt-(--header-h) lg:mt-16">
      <Container>
        <div className="lg:border-t lg:border-wf/40 lg:pt-14">
          <SectionHeading>{compareSection.title}</SectionHeading>
          <p className="mt-4 text-base/[26px] lg:mt-6">{compareSection.intro}</p>
          <DesktopCompare />
          <div className="lg:hidden">
            <MobileCompare />
          </div>
        </div>
      </Container>
    </section>
  )
}
