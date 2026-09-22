import CourseCard from "./course-card"
import SecondaryButton from "./secondary-button"
import type { CollectionCourse } from "../types"

/**
 * One course in the collection list: the course card above its journey-stage
 * explainer and "View course" button on phones, beside them from 768px up
 * (the design's desktop item, used here to avoid a viewport-wide card on
 * tablets).
 */
export default function CollectionItem({ course }: { course: CollectionCourse }) {
  return (
    <li className="rounded-3xl bg-sunken md:flex md:items-start md:gap-11 md:rounded-4xl md:py-6 md:pr-11 md:pl-6">
      <div className="px-4 pt-4 md:min-w-0 md:flex-1 md:max-w-80 md:p-0">
        <CourseCard
          course={course}
          sizes="(min-width: 768px) 320px, calc(100vw - 56px)"
        />
      </div>
      <div className="px-6 pt-6 pb-9 md:min-w-0 md:flex-1 md:max-w-96 md:px-0 md:pt-2 md:pb-0">
        <p className="text-base/6 font-semibold text-informative md:px-2">
          {course.stage}
        </p>
        <div className="flex flex-col gap-3 pt-2 pb-6 text-base/6 md:px-2">
          <p>
            <strong className="font-semibold">{course.note.lead}</strong>{" "}
            {course.note.rest}
          </p>
          <p>
            Next cohort starts{" "}
            <strong className="font-semibold">{course.startDate}</strong>
          </p>
        </div>
        <SecondaryButton
          href={course.href}
          aria-label={`View course: ${course.title}`}
          className="w-full md:w-auto"
        >
          View course
        </SecondaryButton>
      </div>
    </li>
  )
}
