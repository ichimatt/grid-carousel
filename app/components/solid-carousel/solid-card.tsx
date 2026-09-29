import type { CSSProperties } from "react"
import { CollectionGraphic } from "../collection-carousel/collection-graphics"
import { ChevronRightIcon } from "../collection-carousel/icons"
import type { SolidCardData } from "./cards"
import styles from "./solid-carousel.module.css"

export type SolidCardOrientation = "vertical" | "horizontal" | "responsive"
export type SolidCardState = "hover" | "focus"

/**
 * One collection card on a solid tile in the collection's colour (the
 * library's collection-card-content-ii). The whole card is the link.
 * "vertical" stacks the graphic over the copy, as on the mobile rail;
 * "horizontal" sets them side by side in a row the 167px hero makes, as on
 * desktop; "responsive" is vertical until the nearest container reaches
 * 64rem, then horizontal. Hover lifts the shadow and brightens the
 * course-count row; keyboard focus adds the ring. `state` forces either
 * look for documentation.
 */
export default function SolidCard({
  card,
  orientation = "vertical",
  state,
  className = "",
}: {
  card: SolidCardData
  orientation?: SolidCardOrientation
  state?: SolidCardState
  className?: string
}) {
  const ramp = {
    "--ramp-800": card.ramp.tile,
    "--ramp-700": card.ramp.guide,
    "--ramp-500": card.ramp.line,
    "--ramp-300": card.ramp.dot,
    "--ramp-100": card.ramp.kicker,
  } as CSSProperties

  const layout = {
    vertical: {
      card: "flex-col gap-2 pb-5",
      hero: "px-6 py-4",
      copy: "",
    },
    horizontal: {
      card: "flex-row items-center",
      hero: "shrink-0 p-4",
      copy: "min-w-0 flex-1 pr-4",
    },
    responsive: {
      card: "flex-col gap-2 pb-5 @5xl:flex-row @5xl:items-center @5xl:gap-0 @5xl:pb-0",
      hero: "px-6 py-4 @5xl:shrink-0 @5xl:p-4",
      copy: "@5xl:min-w-0 @5xl:flex-1 @5xl:pr-4",
    },
  }[orientation]

  return (
    <a
      href={card.href}
      data-state={state}
      style={ramp}
      className={`${styles.card} flex w-full overflow-clip rounded-lg bg-(--ramp-800) text-white shadow-elevation-1 ${layout.card} ${className}`}
    >
      {/* <a> is transparent, so block wrappers and the heading are valid here.
          The graphic is drawn ~5x larger than its box so its hairlines run
          out across the hero and are clipped by it. */}
      <div className={`flex items-center justify-center overflow-clip ${layout.hero}`}>
        <div className={`${styles.hero} relative size-[135px] shrink-0`}>
          <div className="absolute inset-[-201.48%]">
            <CollectionGraphic name={card.graphic} className={`${styles.graphic} block size-full`} />
          </div>
        </div>
      </div>
      <div className={layout.copy || undefined}>
        <div className="flex flex-col gap-2 px-6">
          <h3 className="text-lg/6 font-semibold tracking-[-0.09px] text-balance">{card.title}</h3>
          <p className={`${styles.link} flex items-center gap-0.5 text-sm/5 text-(--ramp-100)`}>
            {card.courseCount}
            <ChevronRightIcon className="relative top-px" />
          </p>
        </div>
      </div>
    </a>
  )
}
