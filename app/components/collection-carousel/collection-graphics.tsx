import type { SVGProps } from "react"

/**
 * Decorative collection illustrations from the Figma library, inlined so they
 * theme at runtime. Hairlines take currentColor (a host sets it to its theme
 * colour); solid dots take --dot-color and guide lines --guide-color, both
 * defaulting to currentColor; hollow dots fill with --hollow-color (white by
 * default); guides are drawn at --graphic-faint-opacity (7% by default).
 * Geometry is the library's 679-unit artboard; the carousel scales it and
 * keeps hairlines at 1px with vector-effect.
 */
export type GraphicName =
  | "hub"
  | "network"
  | "arrowhead"
  | "staircase"
  | "healthcare"
  | "equaliser"

/**
 * Figma token graphic-faint-opacity: 7% on the light tiles. A host can raise
 * it (the dark solid tiles use 69%) so the guides still read on its ground.
 */
const FAINT = "var(--graphic-faint-opacity, 0.07)"
/** Figma token hollow-color: the hollow dots' fill. */
const HOLLOW = "var(--hollow-color, #fff)"
/** Solid dots take currentColor unless the host sets a lighter --dot-color. */
const DOT = "var(--dot-color, currentColor)"
/** Guide lines take currentColor unless the host sets a --guide-color. */
const GUIDE = "var(--guide-color, currentColor)"

function Dot({ cx, cy, hollow = false }: { cx: number; cy: number; hollow?: boolean }) {
  // The library strokes every dot in its own fill colour, so a solid dot
  // carries no ring of the hairline colour around it.
  return <circle cx={cx} cy={cy} r={8} fill={hollow ? HOLLOW : DOT} stroke={hollow ? undefined : DOT} />
}

/** Faint guide lines that run out across the hero area. */
function Guides({ lines }: { lines: string[] }) {
  return (
    <g stroke={GUIDE} style={{ opacity: FAINT }}>
      {lines.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  )
}

const CROSSHAIRS = [
  "M-0.5 -0.5L679.5 679.5",
  "M679.5 -0.5L-0.5 679.5",
  "M-0.5 339.5L679.5 339.5",
  "M339.5 -0.5L339.5 679.5",
]

const shapes: Record<GraphicName, () => React.ReactNode> = {
  hub: () => (
    <>
      <Guides lines={CROSSHAIRS} />
      <path d="M-0.5 339.5L339.5 339.5" />
      <path d="M339.504 339.5L367.788 367.784" />
      <path d="M367.784 311.212L339.496 339.5" />
      <path d="M339.5 299.5L339.5 379.5" />
      <path d="M339.5 339.5L379.5 339.5" />
      <Dot cx={339.5} cy={339.5} hollow />
      <Dot cx={339.5} cy={299.5} />
      <Dot cx={339.5} cy={379.5} />
      <Dot cx={379.5} cy={339.5} />
      <Dot cx={367.784} cy={311.216} />
      <Dot cx={367.784} cy={367.784} />
    </>
  ),
  network: () => (
    <>
      <Guides lines={CROSSHAIRS} />
      <Dot cx={339.5} cy={339.5} hollow />
      <Dot cx={339.5} cy={299.5} />
      <Dot cx={339.5} cy={379.5} hollow />
      <Dot cx={299.5} cy={339.5} hollow />
      <Dot cx={379.5} cy={339.5} />
      <Dot cx={311.216} cy={367.784} hollow />
      <Dot cx={367.784} cy={311.216} />
      <path d="M300.257 300.259L378.746 378.748" />
      <path
        d="M339.5 331.5C343.918 331.5 347.5 335.082 347.5 339.5C347.5 341.71 346.604 343.709 345.155 345.157L333.842 333.844C335.29 332.395 337.29 331.5 339.5 331.5Z"
        fill={DOT}
        stroke="none"
      />
    </>
  ),
  arrowhead: () => (
    <>
      <Guides
        lines={[
          "M679.502 163.984L-0.50116 556.584",
          "M679.502 122.416L-0.500824 515.016",
          "M679.502 80.8449L-0.501495 473.445",
          "M-0.50116 122.416L679.502 515.016",
          "M-0.502014 163.984L679.502 556.584",
          "M-0.500824 205.557L679.502 598.157",
        ]}
      />
      <path d="M375.5 339.499L303.496 381.07" />
      <path d="M303.5 297.93L375.5 339.499" />
      <Dot cx={375.5} cy={339.499} />
      <Dot cx={339.5} cy={318.715} hollow />
      <Dot cx={339.5} cy={360.283} hollow />
      <Dot cx={303.498} cy={297.93} hollow />
      <Dot cx={303.498} cy={381.07} hollow />
    </>
  ),
  staircase: () => (
    <>
      {/* Horizontal rules and one diagonal only; the verticals were removed
          from the library graphic. */}
      <Guides
        lines={[
          "M0 283.502L679.502 283.502",
          "M0 311.502L679.502 311.502",
          "M0 339.502L679.502 339.502",
          "M0 367.502L679.502 367.502",
          "M0 395.502L679.502 395.502",
          "M679.5 -0.5L-0.5 679.5",
        ]}
      />
      <Dot cx={381.499} cy={297.5} />
      <Dot cx={297.499} cy={381.5} hollow />
      <Dot cx={325.499} cy={353.5} hollow />
      <Dot cx={353.499} cy={325.5} hollow />
      <path d="M283.5 395.5H311.5V367.5H339.5V339.768H367.5V311.5H395.5" />
    </>
  ),
  healthcare: () => (
    <>
      <Guides lines={["M-0.5 339.5L679.5 339.5", "M339.5 -0.5L339.5 679.5"]} />
      <Dot cx={339.5} cy={339.5} hollow />
      {/* The library's inner ring is 21 by 20.5; a circle at 21 is within a
          tenth of a pixel of it at card scale. */}
      <circle cx={339.5} cy={339.5} r={21} />
      <circle cx={339.5} cy={339.5} r={55.5} stroke={GUIDE} style={{ opacity: FAINT }} />
      <Dot cx={339.5} cy={299.5} />
      <Dot cx={339.5} cy={379.5} />
      <Dot cx={299.5} cy={339.5} />
      <Dot cx={379.5} cy={339.5} />
    </>
  ),
  equaliser: () => (
    <>
      <Guides
        lines={[
          "M0 283.502L679.502 283.502",
          "M0 395.502L679.502 395.502",
          "M297.5 -0.5L297.5 679.5",
          "M325.5 -0.5L325.5 679.5",
          "M353.5 -0.5L353.5 679.5",
          "M381.5 -0.5L381.5 679.5",
          "M0.00927734 222.136L679 404.071",
          "M679 274.925L-0.501953 456.996",
        ]}
      />
      <path d="M297.5 377.148L297.501 395.5" />
      <path d="M297.5 283.5L297.5 301.852" />
      <path d="M325.501 369.64L325.5 395.5" />
      <path d="M325.5 283.5L325.5 309.36" />
      <path d="M353.501 362.141L353.5 395.5" />
      <path d="M353.5 283.5C353.5 301.019 353.5 299.341 353.5 316.859" />
      <path d="M381.501 354.637L381.5 395.5" />
      <path d="M381.5 283.5L381.5 324.363" />
      <Dot cx={297.501} cy={339.5} hollow />
      <Dot cx={325.501} cy={339.5} hollow />
      <Dot cx={353.501} cy={339.5} hollow />
      <Dot cx={381.501} cy={339.5} />
    </>
  ),
}

export function CollectionGraphic({
  name,
  ...props
}: { name: GraphicName } & Omit<SVGProps<SVGSVGElement>, "children">) {
  const Shape = shapes[name]
  return (
    <svg
      viewBox="0 0 679 679"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <Shape />
    </svg>
  )
}
