import Image from "next/image"
import { useId } from "react"
import { focusRing } from "./focus-ring"
import type { CollectionCourse } from "../types"

/**
 * The course card (Figma node 960-19729): image, then partner and title.
 * The whole card is a link to the course, lifting to elevation-3 on hover
 * and adding the focus ring on keyboard focus. The link is named by the
 * title and described by the partner, so screen readers lead with the
 * course name. `sizes` describes the rendered width so next/image picks a
 * sensible source.
 */
export default function CourseCard({
  course,
  sizes,
  headingLevel: Heading = "h3",
  className = "",
}: {
  course: CollectionCourse
  sizes: string
  headingLevel?: "h3" | "h4"
  className?: string
}) {
  const id = useId()
  const titleId = `${id}-title`
  const partnerId = `${id}-partner`
  return (
    <a
      href={course.href}
      aria-labelledby={titleId}
      aria-describedby={partnerId}
      className={`block overflow-clip rounded-lg bg-white shadow-elevation-1 transition-shadow hover:shadow-elevation-3 focus-visible:shadow-elevation-3 ${focusRing} ${className}`}
    >
      <div className="relative aspect-[1509/849]">
        <Image
          src={course.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 px-6 pt-4 pb-6">
        <p id={partnerId} className="text-sm/5 text-ink-tertiary">
          {course.provider}
        </p>
        <Heading id={titleId} className="text-lg/6 font-semibold tracking-[-0.09px]">
          {course.title}
        </Heading>
      </div>
    </a>
  )
}
