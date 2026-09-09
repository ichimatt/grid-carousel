import type { Course } from "../../data"
import { type CompareAttribute } from "../../data"

/** Journey-stage band above a course in the comparison. */
export function StageBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[33px] items-center bg-wf/20 px-2.5 text-sm/[26px]">
      {children}
    </div>
  )
}

/** Course link + provider, shared by every mobile compare treatment. */
export function CourseHeading({ course }: { course: Course }) {
  return (
    <>
      <h3 className="mt-3 text-base/[26px] font-bold">
        <a
          href="#"
          className="underline decoration-solid decoration-from-font [text-underline-position:from-font]"
        >
          {course.title}
        </a>
      </h3>
      <p className="text-sm/[26px]">{course.provider}</p>
    </>
  )
}

/** One course's value for one compare attribute. */
export function AttributeValue({
  course,
  attribute,
}: {
  course: Course
  attribute: CompareAttribute
}) {
  if (attribute.key === "price") {
    return (
      <div className="text-sm/[26px]">
        <p className="font-bold">{course.price}</p>
        <p>{course.duration}</p>
        <p className="opacity-80">{course.hoursPerWeek}</p>
      </div>
    )
  }
  return <p className="text-sm/[26px]">{course.compare[attribute.key]}</p>
}

export function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m3 5.5 5 5 5-5" />
    </svg>
  )
}
