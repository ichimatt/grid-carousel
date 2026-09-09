import type { CSSProperties } from "react"
import { CollectionGraphic } from "../collection-carousel/collection-graphics"
import { ChevronRightIcon } from "../collection-carousel/icons"
import styles from "./collection-tile-carousel.module.css"
import type { CollectionTileData } from "./tiles"

export type CollectionTileState = "hover" | "focus"

/**
 * One collection tile: the whole tile is the link. Hover lifts the shadow
 * and colours the course-count row with the collection's theme; keyboard
 * focus adds the focus ring. `state` forces either look for documentation.
 */
export default function CollectionTile({
  tile,
  state,
  className = "",
}: {
  tile: CollectionTileData
  state?: CollectionTileState
  className?: string
}) {
  const theme = {
    "--theme-color": tile.theme.color,
    "--theme-bg": tile.theme.bg,
    "--theme-text": tile.theme.text,
  } as CSSProperties

  return (
    <a
      href={tile.href}
      data-state={state}
      style={theme}
      className={`${styles.tile} flex w-full rounded-lg bg-white p-1 text-ink shadow-elevation-1 ${className}`}
    >
      {/* <a> is transparent, so block wrappers and the heading are valid here. */}
      <div className="flex w-full flex-col gap-2 overflow-clip rounded-sm bg-[linear-gradient(to_bottom,var(--theme-bg),white_50%)] pb-5">
        {/* The graphic is drawn ~5x larger than its box so its hairlines run
            out across the hero and are clipped by it. */}
        <div className="flex items-center justify-center overflow-clip px-6 py-4">
          <div className="relative size-[135px] shrink-0 text-(--theme-color)">
            <div className="absolute inset-[-201.48%]">
              <CollectionGraphic name={tile.graphic} className={`${styles.graphic} block size-full`} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-6">
          <h3 className="text-lg/6 font-semibold tracking-[-0.09px] text-balance">{tile.title}</h3>
          <p className={`${styles.link} flex items-center gap-0.5 text-sm/5 text-ink-secondary`}>
            {tile.courseCount}
            <ChevronRightIcon className="relative top-px" />
          </p>
        </div>
      </div>
    </a>
  )
}
