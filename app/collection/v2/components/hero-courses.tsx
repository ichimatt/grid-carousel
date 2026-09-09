import Container from "../../components/container"
import { CourseCard } from "../../components/course-cards"
import { StageBand } from "../../components/compare/shared"
import { courses } from "../../data"
import { courseNotes, hero } from "../data"

/**
 * The v2 opening: breadcrumb, then a two-column hero where the title and
 * intro stay sticky on desktop while the course list scrolls beside them.
 * On mobile everything stacks.
 */
export default function HeroCourses() {
  return (
    <Container className="pt-6 lg:pt-9">
      <nav aria-label="Breadcrumb" className="text-sm/[21px]">
        <ol className="flex flex-wrap gap-x-3 lg:flex-nowrap">
          <li>
            <a href="#">{hero.breadcrumb.parent}</a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="basis-full font-bold lg:basis-auto" aria-current="page">
            {hero.breadcrumb.current}
          </li>
        </ol>
      </nav>

      <div className="mt-7 lg:mt-9 lg:grid lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-x-24">
        <header className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
          <p className="text-sm/[21px]">{courses.length} courses</p>
          <h1 className="mt-2 text-[23px]/[32px] tracking-[-0.17px] lg:mt-3 lg:text-[45px]/[56px] lg:tracking-[-0.68px]">
            {hero.title}
          </h1>
          <p className="mt-6 text-base/[26px]">{hero.intro}</p>
        </header>

        <section aria-labelledby="v2-course-list" className="mt-9 lg:mt-0">
          {/* Keeps the heading outline h1 -> h2 -> h3 for the card titles. */}
          <h2 id="v2-course-list" className="sr-only">
            Courses in this collection
          </h2>
          <ol className="flex flex-col gap-3">
            {courses.map((course) => {
              const note = courseNotes[course.slug] ?? course.note
              return (
                <li
                  key={course.slug}
                  className="rounded-lg bg-wf/10 p-3 lg:grid lg:grid-cols-[minmax(0,361px)_1fr] lg:items-start lg:gap-x-12 lg:p-5"
                >
                  <CourseCard course={course} />
                  <div className="px-2 pb-3 pt-5 lg:p-0">
                    <StageBand>{course.stage}</StageBand>
                    <p className="mt-4 text-base/[26px] lg:mt-6">
                      <strong>{note.lead}</strong> {note.rest.trim()}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </Container>
  )
}
