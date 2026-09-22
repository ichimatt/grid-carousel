import type { SpringboardCourse } from "../types"
import Container from "./container"
import CourseCard from "./course-card"
import SecondaryButton from "./secondary-button"

const HEADING_ID = "springboard-heading"

/**
 * The course "springboard" (Figma node 910-14635): the five courses in
 * journey order, each introduced by a themed dot-and-line divider, a stage
 * headline and a sunken band holding the course card and a short explainer.
 * Below lg everything stacks and the sunken band bleeds to the viewport
 * edges; from lg each item sits on the page's 12-column grid with the band
 * filling columns 5–12 and continuing through the dividers.
 */
export default function Springboard({
  courses,
}: {
  courses: SpringboardCourse[]
}) {
  return (
    <section aria-labelledby={HEADING_ID} className="lg:py-10">
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
    <div aria-hidden="true" className="pt-6 lg:pt-0">
      <div className="relative flex h-4 items-center lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-8">
        {/* Grid children in paint order: sunken fill, then the grey rule
            (a self-centred grid child so it snaps to a whole pixel like the
            theme line), then the dot and theme line. All three are pinned
            to row 1 so the overlaps are explicit placements, not a second row. */}
        <div className="col-span-8 col-start-5 row-start-1 hidden bg-sunken lg:block" />
        <div className="col-span-full row-start-1 hidden h-px self-center bg-line lg:block" />
        {/* -mr-6 cancels the Container gutter so the line reaches the viewport edge on mobile. */}
        <div className="relative -mr-6 flex flex-1 items-center lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:mr-0 lg:flex-none">
          <span className="size-4 shrink-0 rounded-full bg-(--theme-color)" />
          <span className="h-px flex-1 bg-(--theme-color)" />
        </div>
      </div>
    </div>
  )
}

function Item({ course }: { course: SpringboardCourse }) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* No side padding: the Container already supplies the 24px gutter. */}
      <div className="flex flex-col gap-[7px] py-6 lg:col-span-4 lg:self-start lg:py-14">
        <p className="text-sm/5 text-(--theme-text)">{course.kicker}</p>
        <h3 className="max-w-[304px] text-[23px]/8 font-light tracking-[-0.17px] text-balance text-ink lg:text-[37px]/12 lg:tracking-[-0.46px]">
          {course.stage}
        </h3>
      </div>

      {/*
       * The sunken band: full-bleed below lg (-mx-6 undoes the Container
       * gutter), exactly columns 5–12 from lg. From md the card and explainer
       * sit side by side so the card is not viewport-wide on tablets.
       */}
      <div className="-mx-6 bg-sunken md:flex md:items-start md:justify-center md:gap-11 md:px-6 md:pt-6 md:pb-9 lg:col-span-8 lg:col-start-5 lg:mx-0 lg:px-8 lg:py-14">
        {/* Capped and centred on large phones so the card never grows past
            its desktop width before the side-by-side layout kicks in. */}
        <div className="mx-auto max-w-[368px] px-6 pt-6 md:mx-0 md:min-w-0 md:max-w-80 md:flex-1 md:p-0">
          <CourseCard
            course={course}
            // 320px from md, except between lg and xl where the eight-column
            // band is too narrow and the card shrinks to roughly a quarter of
            // the viewport.
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 26vw, (min-width: 768px) 320px, calc(100vw - 48px)"
            headingLevel="h4"
          />
        </div>

        <div className="md:min-w-0 md:max-w-80 md:flex-1">
          <div className="flex flex-col gap-3 px-8 py-6 text-base/6 md:px-2 md:pt-2 md:pb-6">
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
          <div className="flex px-7 pb-9 md:px-0 md:pb-0">
            <SecondaryButton
              href={course.href}
              aria-label={`View course: ${course.title}`}
              className="w-full md:w-auto"
            >
              View course
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}
