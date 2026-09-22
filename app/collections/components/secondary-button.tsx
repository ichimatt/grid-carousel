import type { ComponentProps } from "react"
import { ButtonChevronIcon } from "@/app/components/collection-carousel/icons"
import { focusRing } from "./focus-ring"

/**
 * The design system's outlined button ("m-button", secondary rounded
 * inverse), documented in Figma node 960-19729: transparent with an ink
 * border at rest, a #f6f8fb fill on hover and keyboard focus, white while
 * pressed, and a 3px focus ring offset by 1px of white. Rendered as a link
 * because every use on the collection page navigates to a course.
 */
export default function SecondaryButton({
  children,
  className = "",
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      {...props}
      className={`inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-ink bg-transparent pr-3 pl-6 text-sm/5 font-medium text-ink transition-colors hover:bg-button-inverse-hover focus-visible:bg-button-inverse-hover active:bg-white ${focusRing} ${className}`}
    >
      {children}
      <ButtonChevronIcon className="shrink-0" />
    </a>
  )
}
