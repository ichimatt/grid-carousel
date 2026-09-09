"use client"

import { useId, useRef, useState } from "react"
import Container from "../../components/container"
import {
  insightSections,
  type InsightParagraph,
  type InsightSection,
} from "../data"
import NumberedCarousel from "./numbered-carousel"
import { NumberedCircle, SectionHeading } from "./ui"

function ItemText({ item }: { item: { lead?: string; rest: string } }) {
  return (
    <>
      {item.lead && <strong>{item.lead}</strong>}
      {item.rest}
    </>
  )
}

function ProseParagraph({ paragraph }: { paragraph: InsightParagraph }) {
  return (
    <p className="text-base/[26px]">
      {"pre" in paragraph && paragraph.pre}
      {"lead" in paragraph && <strong>{paragraph.lead}</strong>}
      {paragraph.rest}
    </p>
  )
}

/** Desktop: a vertical tab rail selecting one of the four sections. */
function DesktopInsightTabs() {
  const baseId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const section = insightSections[activeIndex]
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const panelId = `${baseId}panel`
  const tabId = (index: number) => `${baseId}tab-${index}`

  const selectTab = (index: number) => {
    const next = (index + insightSections.length) % insightSections.length
    setActiveIndex(next)
    tabRefs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const handlers: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: insightSections.length - 1,
    }
    if (event.key in handlers) {
      event.preventDefault()
      selectTab(handlers[event.key])
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,23rem)_1fr] gap-x-24">
      <div
        role="tablist"
        aria-label="More about these courses"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col self-start rounded-lg bg-wf/14 px-2.5 py-8"
      >
        {insightSections.map((option, index) => (
          <button
            key={option.rail}
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
            className={`flex min-h-[54px] items-center px-7 py-2 text-left text-[17px]/[26px] font-bold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-wf ${
              index === activeIndex ? "bg-wf text-white" : ""
            }`}
          >
            {option.rail}
          </button>
        ))}
      </div>

      {/* tabIndex: the panel holds static text, so it takes focus itself (APG tabs). */}
      <div role="tabpanel" id={panelId} aria-labelledby={tabId(activeIndex)} tabIndex={0}>
        <SectionHeading className="max-w-[36rem]">{section.title}</SectionHeading>
        {section.kind === "numbered" ? (
          <ol className="mt-9 flex flex-col gap-10">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start gap-10">
                <NumberedCircle number={index + 1} />
                <p className="max-w-[31rem] pt-[5px] text-base/[26px]">
                  <ItemText item={item} />
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-6 flex max-w-[615px] flex-col gap-4">
            {section.paragraphs.map((paragraph, index) => (
              <ProseParagraph key={index} paragraph={paragraph} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Mobile: prose collapsed to its first lines behind a "more" toggle. */
function ExpandableProse({ paragraphs }: { paragraphs: InsightParagraph[] }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="mt-6">
      {expanded ? (
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, index) => (
            <ProseParagraph key={index} paragraph={paragraph} />
          ))}
        </div>
      ) : (
        <p className="line-clamp-5 text-base/[26px]">
          {"pre" in paragraphs[0] && paragraphs[0].pre}
          {"lead" in paragraphs[0] && <strong>{paragraphs[0].lead}</strong>}
          {paragraphs[0].rest}
        </p>
      )}
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-base/[26px] font-bold"
      >
        {expanded ? "less" : "more"}
      </button>
    </div>
  )
}

function MobileInsightSection({ section }: { section: InsightSection }) {
  return (
    <Container>
      <SectionHeading className="max-w-[36rem]">{section.title}</SectionHeading>
      {section.kind === "numbered" ? (
        <NumberedCarousel label={section.title}>
          {section.items.map((item, index) => (
            <p key={index} className="text-base/[26px]">
              <ItemText item={item} />
            </p>
          ))}
        </NumberedCarousel>
      ) : (
        <ExpandableProse paragraphs={section.paragraphs} />
      )}
    </Container>
  )
}

/**
 * The four "more about these courses" sections. Desktop shows them as a
 * tabbed rail beside the active panel; mobile stacks all four, numbered
 * lists becoming peeking carousels on alternating tinted bands.
 */
export default function InsightSections() {
  return (
    <>
      <section className="mt-16 hidden lg:block">
        <Container>
          <div className="border-t border-wf/40 pt-14">
            <DesktopInsightTabs />
          </div>
        </Container>
      </section>

      <div className="mt-2 lg:hidden">
        {insightSections.map((section, index) => (
          <section
            key={section.rail}
            className={index % 2 === 1 ? "bg-wf/14 py-12" : "py-12"}
          >
            <MobileInsightSection section={section} />
          </section>
        ))}
      </div>
    </>
  )
}
