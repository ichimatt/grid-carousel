import type { SpringboardCourse } from "../types"
import Container from "./container"
import CourseCard from "./course-card"
import SecondaryButton from "./secondary-button"

const HEADING_ID = "springboard-heading"

/**
 * The course "springboard" (Figma node 1128-34552): the five courses in
 * journey order, each introduced by a themed dot-and-line divider, a stage
 * headline and a sunken band holding the course card and a short explainer.
 * Below the desktop layout everything stacks and the band fills the content
 * column, with the card and explainer side by side from 650px; from 1040px
 * each item sits on the page's 12-column grid with the band filling columns
 * 5–12 and continuing through the dividers.
 */
export default function Springboard({
  courses,
}: {
  courses: SpringboardCourse[]
}) {
  return (
    <section aria-labelledby={HEADING_ID} className="desktop:py-10">
      <h2 id={HEADING_ID} className="sr-only">
        Courses in this collection
      </h2>
      <Container>
        {/* role="list" keeps list semantics in Safari once list-style is removed. */}
        <ol role="list">
          {courses.map((course) => (
            <li key={course.slug}>
              <Divider />
              <Item course={course} />
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

/**
 * Decorative row above each item. Mobile: a 24px gap, then the theme dot at
 * the gutter with its line running off the right edge of the viewport.
 * Desktop: the dot and line span the first three grid columns over a grey
 * rule that crosses the full content width, while columns 5–12 stay sunken
 * so the band reads as one continuous strip from item to item.
 */
function Divider() {
  return (
    <div aria-hidden="true" className="pt-6 desktop:pt-0">
      <div className="relative flex h-4 items-center desktop:grid desktop:grid-cols-12 desktop:items-stretch desktop:gap-x-8">
        {/* Grid children in paint order: sunken fill, then the grey rule
            (a self-centred grid child so it snaps to a whole pixel like the
            theme line), then the dot and theme line. All three are pinned
            to row 1 so the overlaps are explicit placements, not a second row. */}
        <div className="col-span-8 col-start-5 row-start-1 hidden bg-sunken desktop:block" />
        <div className="col-span-full row-start-1 hidden h-px self-center bg-line desktop:block" />
        {/* -mr-6 cancels the Container gutter so the line reaches the column's edge on mobile. */}
        <div className="relative -mr-6 flex flex-1 items-center desktop:col-span-3 desktop:col-start-1 desktop:row-start-1 desktop:mr-0 desktop:flex-none">
          <span className="size-4 shrink-0 rounded-full bg-(--theme-color)" />
          <span className="h-px flex-1 bg-(--theme-color)" />
        </div>
      </div>
    </div>
  )
}

function Item({ course }: { course: SpringboardCourse }) {
  return (
    <div className="desktop:grid desktop:grid-cols-12 desktop:gap-x-8">
      {/* No side padding: the Container already supplies the 24px gutter. */}
      <div className="flex flex-col gap-[7px] py-6 desktop:col-span-4 desktop:self-start desktop:py-14">
        <p className="text-sm/5 text-(--theme-text)">{course.kicker}</p>
        <h3 className="max-w-[304px] text-[23px]/8 font-light tracking-[-0.17px] text-balance text-ink desktop:text-[37px]/12 desktop:tracking-[-0.46px]">
          {course.stage}
        </h3>
      </div>

      {/*
       * The sunken band: the full content column below the desktop layout
       * (-mx-6 undoes the Container gutter), exactly columns 5–12 from it.
       * From 650px the card and explainer share a two-column grid with 16px
       * of padding (the guideline's "post-650" frame); the desktop band is
       * centred with the wider padding of the 1512px frame.
       */}
      <div className="-mx-6 bg-sunken tablet:grid tablet:grid-cols-2 tablet:gap-4 tablet:p-4 desktop:col-span-8 desktop:col-start-5 desktop:mx-0 desktop:flex desktop:items-start desktop:justify-center desktop:gap-11 desktop:px-8 desktop:py-14">
        <div className="px-6 pt-6 tablet:max-w-80 tablet:p-0 desktop:min-w-0 desktop:flex-1">
          <CourseCard
            course={course}
            // 320px once the card shares its band, except between 1040 and
            // 1280px where the eight-column band is too narrow and the card
            // shrinks to roughly a quarter of the viewport.
            sizes="(min-width: 1280px) 320px, (min-width: 1040px) 26vw, (min-width: 650px) 320px, calc(100vw - 48px)"
            headingLevel="h4"
          />
        </div>

        <div className="desktop:min-w-0 desktop:max-w-80 desktop:flex-1">
          <div className="flex flex-col gap-3 px-8 py-6 text-base/6 tablet:px-2 tablet:pt-2 tablet:pb-6">
            <p>
              <strong className="font-semibold">{course.note.lead}</strong>{" "}
              {course.note.rest}
            </p>
            <p>
              Next cohort starts{" "}
              <strong className="font-semibold">{course.startDate}</strong>
            </p>
          </div>
          {/* A flex wrapper (not a line box) keeps the full-width mobile button free of strut space. */}
          <div className="flex px-7 pb-9 tablet:px-0 tablet:pb-0">
            <SecondaryButton
              href={course.href}
              aria-label={`View course: ${course.title}`}
              className="w-full tablet:w-auto"
            >
              View course
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
