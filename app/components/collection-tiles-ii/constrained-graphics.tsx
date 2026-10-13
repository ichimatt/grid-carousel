import { createElement, useId, type SVGProps } from "react"
import {
  constrainedGraphics,
  DISC,
  GRAPHIC_VIEW_BOX,
  type ConstrainedGraphicName,
} from "./constrained-graphics-data"

export type { ConstrainedGraphicName } from "./constrained-graphics-data"

/**
 * The "constrained graphic" from the Figma library: a 72px disc holding one
 * flat symbol per collection, drawn in three steps of the collection's ramp
 * (--theme-symbol-light, --theme-symbol, --theme-symbol-dark) and lifted by
 * the elevation-1 shadow. The geometry lives in constrained-graphics-data so
 * the Optimizely snippet can draw the same symbols.
 */
export function ConstrainedGraphic({
  name,
  className = "",
  ...props
}: { name: ConstrainedGraphicName } & Omit<SVGProps<SVGSVGElement>, "children">) {
  const clipId = useId()
  return (
    <svg
      viewBox={GRAPHIC_VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      className={`rounded-full shadow-elevation-1 ${className}`}
      {...props}
    >
      {/* Symbols reach past the disc (the eye's lobes, the cross's corner
          squares), so the disc clips them as it does in the library. */}
      <clipPath id={clipId}>
        <rect {...DISC} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {constrainedGraphics[name].map(({ tag, ...attrs }, index) =>
          createElement(tag, { key: index, ...attrs })
        )}
      </g>
    </svg>
  )
}
