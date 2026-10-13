import type { Metadata } from "next"
import CollectionTile, { TileContainer } from "../../../components/collection-tiles-ii/collection-tile"
import CollectionTileCarousel from "../../../components/collection-tiles-ii/collection-tile-carousel"
import { collectionTiles } from "../../../components/collection-tiles-ii/tiles"

export const metadata: Metadata = {
  title: "Collection tiles II",
}

/** Page padding, matched by every element that isn't full-bleed. */
const GUTTER = "px-6 lg:px-10"
/** The design's line colour, separating an artboard from the page that shares its background. */
const FRAME = "border-line"

const [sample] = collectionTiles

/** The five variants at the widths the overview draws them. */
const variants = [
  { name: "portrait", width: 228, note: "under 280px" },
  { name: "portrait-fullwidth", width: 312, note: "280px and up" },
  { name: "landscape", width: 416, note: "416px and up" },
  { name: "landscape-wider", width: 668, note: "600px and up" },
  { name: "landscape-fullwidth", width: 1360, note: "960px and up" },
]

const counts = [
  { name: "One tile", items: collectionTiles.slice(0, 1), note: "Upright and full width until 640px, then landscape, growing into the wider and full-width layouts at 648px and 1008px." },
  { name: "Two tiles", items: collectionTiles.slice(0, 2), note: "A rail until 928px, where two landscape tiles fit side by side; they turn wider from 1296px." },
  { name: "Three or more", items: collectionTiles, note: "A rail until 928px, then two per page, and three per page from 1368px, with arrows and a dot per page." },
]

export default function CollectionTilesReviewPage() {
  return (
    <main className="flex flex-col gap-12 py-10">
      <header className={`max-w-2xl ${GUTTER}`}>
        <p className="text-sm/5 font-medium text-ink-secondary">Component review</p>
        <h1 className="mt-1 text-2xl/8 font-semibold">Collection tiles II</h1>
        <p className="mt-3 text-base/6 text-ink-secondary">
          One tile with five layouts. It never measures the window: it takes the
          width of its container and picks its variant from that, so the same
          component serves one, two or many collections wherever it is placed.
          Every artboard below renders it live.
        </p>
      </header>

      <section aria-labelledby="tile-variants" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="tile-variants" className="text-lg/6 font-semibold">
            Variants by container width
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            Each box is a container of the width the design draws the variant
            at. The landscape layouts need a container that allows them; a
            mobile container keeps the tile upright at any width. Hover or
            focus a tile for its states.
          </p>
        </div>
        {/* The boxes keep their widths whatever the window, scrolling sideways
            when it is narrower, so each caption always describes what it shows. */}
        <div className="overflow-x-auto">
          <div className={`flex w-max flex-col items-start gap-6 ${GUTTER}`}>
            {variants.map((variant) => (
              <figure key={variant.name} className="flex flex-col items-start gap-3">
                <TileContainer width={variant.width}>
                  <CollectionTile tile={sample} />
                </TileContainer>
                <figcaption className="max-w-3xl text-sm/5 text-ink-secondary">
                  <span className="font-medium text-ink">{variant.name}</span>
                  {` · ${variant.width}px container · ${variant.note}`}
                </figcaption>
              </figure>
            ))}
            <figure className="flex flex-col items-start gap-3">
              <TileContainer mode="mobile" width={416}>
                <CollectionTile tile={sample} />
              </TileContainer>
              <figcaption className="max-w-3xl text-sm/5 text-ink-secondary">
                <span className="font-medium text-ink">portrait-fullwidth</span>
                {" · 416px mobile container · stays upright because the container doesn’t allow landscape"}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section aria-labelledby="artboard-mobile" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-mobile" className="text-lg/6 font-semibold">
            Mobile
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            360px · One tile fills the width. Two or more ride a rail of 216px
            tiles on the gutter, with a dot per tile. Swipe or tap the dots.
          </p>
        </div>
        <div className={`flex flex-wrap items-start gap-11 ${GUTTER}`}>
          {[
            { name: "Only child", items: collectionTiles.slice(0, 1) },
            { name: "Two or more", items: collectionTiles },
          ].map((artboard) => (
            <figure key={artboard.name} className="flex w-[362px] max-w-full flex-col gap-3">
              {/* 362px so the 1px frame leaves a 360px artboard inside it. */}
              <div className={`overflow-clip rounded-lg border ${FRAME}`}>
                <CollectionTileCarousel
                  items={artboard.items}
                  label={`Course collections (${artboard.name.toLowerCase()} preview)`}
                />
              </div>
              <figcaption className="text-sm/5 text-ink-secondary">
                <span className="font-medium text-ink">{artboard.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="artboard-responsive" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-responsive" className="text-lg/6 font-semibold">
            Responsive
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            Full width · Resize the window to see each reflow. The carousel
            counts how many landscape tiles its content width could hold at
            416px and lays out that many columns, never more than three, with
            arrows beside the dots; below that it is the mobile rail, dots
            only. Each tile then picks its variant from the width it ends up
            with.
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {counts.map((artboard) => (
            <figure key={artboard.name} className="flex flex-col gap-3">
              <figcaption className={`text-sm/5 text-ink-secondary ${GUTTER}`}>
                <span className="font-medium text-ink">{artboard.name}</span> · {artboard.note}
              </figcaption>
              {/* Full-bleed, so the tiles centre inside the page exactly as
                  they would on a real one. */}
              <div className={`border-y ${FRAME}`}>
                <CollectionTileCarousel
                  items={artboard.items}
                  label={`Course collections (${artboard.name.toLowerCase()} preview)`}
                />
              </div>
            </figure>
          ))}
        </div>
      </section>
    </main>
  )
}
