import Image from "next/image"
import type { CollectionCourse } from "../types"
import ArrowGlyph from "./arrow-glyph"
import { focusRing } from "./focus-ring"

/**
 * The compact course link used by the comparison table (Figma 847:14075,
 * states in node 960-19729): image, partner and title with a trailing
 * chevron. Vertical in the desktop columns (partner above the title),
 * horizontal on mobile with a 56px thumbnail (title above the partner). The
 * whole item is the link; it tints to the sunken grey on hover and on
 * keyboard focus, where it also gets the focus ring.
 */
export default function ComparisonItem({
  course,
  orientation = "vertical",
  className = "",
}: {
  course: CollectionCourse
  orientation?: "vertical" | "horizontal"
  className?: string
}) {
  const vertical = orientation === "vertical"
  return (
    <a
      href={course.href}
      className={`group flex gap-3 rounded-xl transition-colors hover:bg-sunken focus-visible:bg-sunken ${focusRing} ${
        vertical ? "flex-col px-1 pt-1 pb-2" : "items-start p-1"
      } ${className}`}
    >
      <div
        className={`relative shrink-0 overflow-clip rounded-lg shadow-elevation-1 ${
          vertical ? "aspect-[1509/849] w-full" : "size-14"
        }`}
      >
        <Image
          src={course.image}
          alt=""
          fill
          // Desktop columns are a fifth of the content width: 246px once
          // the page reaches its 1360px cap, narrower from lg up to there.
          sizes={
            vertical
              ? "(min-width: 1440px) 246px, (min-width: 1024px) calc((100vw - 208px) / 5), 56px"
              : "56px"
          }
          className="object-cover"
        />
      </div>
      {/* The heading stays first in the DOM; the vertical layout only
          reorders the partner visually. */}
      <div
        className={`flex min-w-0 flex-1 flex-col px-1 ${vertical ? "gap-1" : "gap-0.5"}`}
      >
        <h3 className="text-sm/5 font-semibold text-ink">
          {course.title}
          <ArrowGlyph className="text-ink-tertiary" />
        </h3>
        {/* Darkens on the sunken tint, where tertiary ink falls just short of AA. */}
        <p
          className={`text-xs/4 text-ink-tertiary transition-colors group-hover:text-ink-secondary group-focus-visible:text-ink-secondary ${vertical ? "order-first" : ""}`}
        >
          {course.provider}
        </p>
      </div>
    </a>
  )
}
