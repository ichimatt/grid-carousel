import type { CSSProperties } from "react"
import { ButtonChevronIcon, ChevronRightIcon } from "../collection-carousel/icons"
import styles from "./collection-tile-carousel.module.css"
import { ConstrainedGraphic } from "./constrained-graphics"
import type { CollectionTileData } from "./tiles"

/**
 * One collection tile (the library's collection-card-content-viii). The
 * whole tile is the link. It has no size of its own: it takes the width of
 * its container and picks its variant from that width with container
 * queries, as the stylesheet documents. Upright below 26rem (full-width
 * padding from 17.5rem); from 26rem it turns landscape, growing into the
 * wider and full-width layouts at 37.5rem and 60rem, but only inside a
 * container named "desktop": a plain "tile" container keeps it upright at
 * any width, which is how the carousel keeps mobile upright.
 */
export default function CollectionTile({ tile }: { tile: CollectionTileData }) {
  const theme = {
    "--theme-bg": tile.theme.bg,
    "--theme-symbol-light": tile.theme.symbolLight,
    "--theme-symbol": tile.theme.symbol,
    "--theme-symbol-dark": tile.theme.symbolDark,
    "--theme-text": tile.theme.text,
  } as CSSProperties

  return (
    <a href={tile.href} style={theme} className={`${styles.tile} font-noto text-ink`}>
      {/* <a> is transparent, so block wrappers and the heading are valid here. */}
      <div className={styles.inner}>
        <div className={styles.hero}>
          <ConstrainedGraphic name={tile.graphic} className="size-[72px] shrink-0" />
        </div>
        <div className={styles.copy}>
          <div className={styles.heading}>
            <p className={styles.kicker}>{tile.name}</p>
            <span aria-hidden="true" className={styles.divider}>
              •
            </span>
            <h3 className={styles.headline}>{tile.headline}</h3>
          </div>
          <p className={styles.link}>
            <span>{tile.courseCount}</span>
            <ChevronRightIcon className={styles.chevron} />
            {/* The full-width variant's call to action is part of the same
                link, so it is a styled span rather than a nested control. The
                space keeps it a separate word in the link's name; flex
                layout doesn't render it. */}{" "}
            <span className={styles.button}>
              {tile.cta}
              <ButtonChevronIcon />
            </span>
          </p>
        </div>
      </div>
    </a>
  )
}

/**
 * A sized box for showing the tile on its own. "desktop" lets the tile turn
 * landscape when the box is wide enough; "mobile" keeps it upright.
 */
export function TileContainer({
  mode = "desktop",
  width,
  children,
}: {
  mode?: "desktop" | "mobile"
  width?: number | string
  children: React.ReactNode
}) {
  return (
    <div
      className={mode === "desktop" ? styles.desktopBox : styles.mobileBox}
      style={width === undefined ? undefined : { width }}
    >
      {children}
    </div>
  )
}
