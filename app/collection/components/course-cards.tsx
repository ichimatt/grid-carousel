import Image from "next/image"
import Carousel from "@/app/components/carousel"
import { courses, type Course } from "../data"

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="overflow-clip rounded-lg border border-wf bg-white">
      <div className="relative aspect-[425/234] bg-wf">
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 92vw"
          className="object-cover mix-blend-luminosity"
        />
      </div>
      <div className="p-5 pt-4 lg:p-6 lg:pt-4">
        <h3 className="text-lg/[26px] font-bold">{course.title}</h3>
        <p className="mt-1 text-sm/[26px]">{course.provider}</p>
        <p className="mt-3 text-sm/[18px]">
          <strong>{course.duration}</strong> starting <strong>{course.startDate}</strong>
        </p>
      </div>
    </article>
  )
}

function CourseNote({ course }: { course: Course }) {
  return (
    <div className="rounded-lg bg-wf/14 p-5 lg:p-6">
      <p className="text-base/[26px]">
        <strong>{course.note.lead}</strong>
        {course.note.rest}
      </p>
    </div>
  )
}

/**
 * The curated course list: a peeking carousel on small screens, a grid on
 * desktop. Card and note are separate subgrid rows on desktop so the notes
 * top-align across a row.
 */
export default function CourseCards() {
  return (
    <section aria-label="Courses in this collection">
      {/* Mobile / tablet: scroll-snap carousel with the next card peeking */}
      <div className="lg:hidden">
        <Carousel
          label="Courses in this collection"
          slidesPerView={{ 0: 1, 560: 2, 850: 3 }}
          peek="1rem"
          bleed
          className="text-wf [--carousel-fade:white]"
        >
          {courses.map((course) => (
            <div key={course.slug} className="flex h-full flex-col gap-4">
              <CourseCard course={course} />
              <div className="flex-1">
                <CourseNote course={course} />
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Desktop: 3-up grid; per chunk the cards share a row and the notes
          share the next, so notes top-align under their cards. */}
      <div className="hidden lg:flex lg:flex-col lg:gap-10">
        {[courses.slice(0, 3), courses.slice(3)].map((chunk) => (
          <div key={chunk[0].slug} className="grid grid-cols-3 gap-x-4 gap-y-4">
            {chunk.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
            {chunk.map((course) => (
              <CourseNote key={course.slug} course={course} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
