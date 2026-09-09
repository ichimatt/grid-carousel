import type { Metadata } from "next"
import CollectionTile, { type CollectionTileState } from "../../components/collection-tiles/collection-tile"
import CollectionTileCarousel from "../../components/collection-tiles/collection-tile-carousel"
import { sampleTile } from "../../components/collection-tiles/tiles"

export const metadata: Metadata = {
  title: "Collection tiles",
}

/** Page padding, matched by every element that isn't full-bleed. */
const GUTTER = "px-6 lg:px-10"
/** The design's line colour, separating an artboard from the page that shares its background. */
const FRAME = "border-line"

const tileStates: { name: string; state?: CollectionTileState }[] = [
  { name: "Default" },
  { name: "Hover", state: "hover" },
  { name: "Focus", state: "focus" },
]

export default function CollectionTilesReviewPage() {
  return (
    <main className="flex flex-col gap-12 py-10">
      <header className={`max-w-2xl ${GUTTER}`}>
        <p className="text-sm/5 font-medium text-ink-secondary">Component review</p>
        <h1 className="mt-1 text-2xl/8 font-semibold">Collection tiles</h1>
        <p className="mt-3 text-base/6 text-ink-secondary">
          The mini tile at every breakpoint. Both artboards render the same
          component, which adapts to the width of its container, so each
          behaves exactly as it would in a browser of that size.
        </p>
      </header>

      <section aria-labelledby="tile-states" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="tile-states" className="text-lg/6 font-semibold">
            Tile states
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            Hover lifts the tile and colours the course count with the
            collection&apos;s theme; keyboard focus adds the ring. The live
            tiles below respond to a real pointer and keyboard.
          </p>
        </div>
        <div className={`flex flex-wrap gap-5 ${GUTTER}`}>
          {tileStates.map(({ name, state }) => (
            <figure key={name} className="flex w-[198px] flex-col gap-3">
              <CollectionTile tile={sampleTile} state={state} />
              <figcaption className="text-sm/5 text-ink-secondary">{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="artboard-mobile" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-mobile" className="text-lg/6 font-semibold">
            Mobile
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            360px · A rail on the gutter, tiles sized so half of the next one
            always peeks. Swipe or tap the dots.
          </p>
        </div>
        <div className={GUTTER}>
          <div className={`w-[360px] max-w-full overflow-clip rounded-lg border ${FRAME}`}>
            <CollectionTileCarousel label="Course collections (mobile preview)" />
          </div>
        </div>
      </section>

      <section aria-labelledby="artboard-responsive" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-responsive" className="text-lg/6 font-semibold">
            Responsive
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            Full width · Resize the window to see it reflow. Up to 1024px it is
            the rail: one and a half tiles show, two and a half from 576px and
            three and a half from 896px. From 1024px the tiles fill a 1360px
            content width with the gutters outside it, as many per page as fit
            at a 198px minimum, and the page controls appear only while they
            don&apos;t all fit.
          </p>
        </div>
        {/* Full-bleed, so the carousel's own background runs edge to edge
            and the tiles centre inside it exactly as they would on a page. */}
        <div className={`border-y ${FRAME}`}>
          <CollectionTileCarousel label="Course collections (responsive preview)" />
        </div>
      </section>
    </main>
  )
}
