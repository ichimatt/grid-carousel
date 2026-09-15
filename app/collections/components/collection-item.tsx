import Image from "next/image"
import { ButtonChevronIcon } from "@/app/components/collection-carousel/icons"
import type { CollectionCourse } from "../enterprise-ai/data"

function CourseCard({ course }: { course: CollectionCourse }) {
  return (
    <div className="overflow-clip rounded-lg bg-white shadow-elevation-1">
      <div className="relative aspect-[1509/849]">
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, calc(100vw - 56px)"
          className="object-cover"
        />
        {/* The ribbon sits over the bottom of the image. */}
        <p className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-ink/90 px-6 py-2 text-sm/5 whitespace-nowrap text-white backdrop-blur-[10px]">
          <span>{course.type}</span>
          <span aria-hidden="true" className="opacity-50">
            •
          </span>
          <span>{course.duration}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 px-6 pt-4 pb-6">
        <p className="text-sm/5 text-ink-tertiary">{course.provider}</p>
        <h3 className="text-lg/6 font-semibold tracking-[-0.09px]">
          {course.title}
        </h3>
      </div>
    </div>
  )
}

/**
 * One course in the collection list: the course card above its journey-stage
 * explainer and "View course" button on phones, beside them from 768px up
 * (the design's desktop item, used here to avoid a viewport-wide card on
 * tablets). The button's hover and focus treatments are not in the design
 * and follow the carousel controls' conventions.
 */
export default function CollectionItem({ course }: { course: CollectionCourse }) {
  return (
    <li className="rounded-3xl bg-sunken md:flex md:items-start md:gap-11 md:rounded-4xl md:py-6 md:pr-11 md:pl-6">
      <div className="px-4 pt-4 md:min-w-0 md:flex-1 md:max-w-80 md:p-0">
        <CourseCard course={course} />
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
        <a
          href={course.href}
          className="flex h-12 items-center justify-center gap-1.5 rounded-full border border-ink pr-3 pl-6 text-sm/5 font-medium text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:inline-flex"
        >
          View course
          <span className="sr-only">: {course.title}</span>
          <ButtonChevronIcon />
        </a>
      </div>
    </li>
  )
}
