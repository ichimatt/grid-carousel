import type { Metadata } from "next"
import CollectionCarousel from "../../components/collection-carousel/collection-carousel"

export const metadata: Metadata = {
  title: "Collection carousel",
}

/** Page padding, matched by every element that isn't full-bleed. */
const GUTTER = "px-6 lg:px-10"
/** The design's line colour, separating an artboard from the page that shares its background. */
const FRAME = "border-line"

const mobileArtboards = [
  {
    name: "Card",
    variant: "default",
    note: "The current card is centred, neighbours peeking either side.",
  },
  {
    name: "Mini card",
    variant: "mini",
    note: "Compact cards on a rail that sits on the gutter, off-centre.",
  },
] as const

export default function CollectionCarouselReviewPage() {
  return (
    <main className="flex flex-col gap-12 py-10">
      <header className={`max-w-2xl ${GUTTER}`}>
        <p className="text-sm/5 font-medium text-ink-secondary">Component review</p>
        <h1 className="mt-1 text-2xl/8 font-semibold">Collection carousel</h1>
        <p className="mt-3 text-base/6 text-ink-secondary">
          Every artboard below renders the same component. It adapts to the
          width of its container, so each behaves exactly as it would in a
          browser of that size.
        </p>
      </header>

      <section aria-labelledby="artboard-mobile" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-mobile" className="text-lg/6 font-semibold">
            Mobile
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            360px · Two treatments. Swipe or tap the dots. No auto-rotation.
          </p>
        </div>
        <div className={`flex flex-wrap items-start gap-11 ${GUTTER}`}>
          {mobileArtboards.map((artboard) => (
            <figure key={artboard.name} className="flex w-[360px] max-w-full flex-col gap-3">
              <div className={`overflow-clip rounded-lg border ${FRAME}`}>
                <CollectionCarousel
                  variant={artboard.variant}
                  label={`Course collections (${artboard.name.toLowerCase()} preview)`}
                />
              </div>
              <figcaption className="text-sm/5 text-ink-secondary">
                <span className="font-medium text-ink">{artboard.name}</span> · {artboard.note}
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
            Full width · Resize the window to see it reflow. Up to 576px one
            card is centred with its neighbours peeking; from 576px two cards
            show at a time; from 1024px it becomes the wide desktop card, which
            auto-rotates every 6 seconds and holds while the call to action is
            hovered.
          </p>
        </div>
        {/* Full-bleed, so the carousel's own background runs edge to edge
            and the card centres inside it exactly as it would on a page. */}
        <div className={`border-y ${FRAME}`}>
          <CollectionCarousel label="Course collections (responsive preview)" />
        </div>
      </section>
    </main>
  )
}
