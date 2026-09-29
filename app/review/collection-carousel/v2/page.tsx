import type { Metadata } from "next"
import SolidCarousel from "../../../components/solid-carousel/solid-carousel"

export const metadata: Metadata = {
  title: "Collection carousel II",
}

/** Page padding, matched by every element that isn't full-bleed. */
const GUTTER = "px-6 lg:px-10"
/** The design's line colour, separating an artboard from the page that shares its background. */
const FRAME = "border-line"

export default function SolidCarouselReviewPage() {
  return (
    <main className="flex flex-col gap-12 py-10">
      <header className={`max-w-2xl ${GUTTER}`}>
        <p className="text-sm/5 font-medium text-ink-secondary">Component review</p>
        <h1 className="mt-1 text-2xl/8 font-semibold">Collection carousel II</h1>
        <p className="mt-3 text-base/6 text-ink-secondary">
          The mini card on a solid tile in the collection&apos;s colour: upright
          on the mobile rail, turned on its side for desktop. Every artboard
          below renders the same component. It adapts to the width of its
          container, so each behaves exactly as it would in a browser of that
          size.
        </p>
      </header>

      <section aria-labelledby="artboard-mobile" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="artboard-mobile" className="text-lg/6 font-semibold">
            Mobile
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            360px · A rail on the gutter, cards sized so half of the next one
            always peeks. Swipe or tap the dots. No auto-rotation.
          </p>
        </div>
        <div className={GUTTER}>
          {/* 362px so the 1px frame leaves a 360px artboard inside it. */}
          <div className={`w-[362px] max-w-full overflow-clip rounded-lg border ${FRAME}`}>
            <SolidCarousel label="Course collections (mobile preview)" />
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
            the rail: one and a half cards show, two and a half from 576px and
            three and a half from 896px. From 1024px the cards turn on their
            side and fill a 1360px content width with the gutters outside it,
            two per page and three from 1312px, with arrows and a dot per page.
          </p>
        </div>
        {/* Full-bleed, so the carousel's own background runs edge to edge
            and the cards centre inside it exactly as they would on a page. */}
        <div className={`border-y ${FRAME}`}>
          <SolidCarousel label="Course collections (responsive preview)" />
        </div>
      </section>
    </main>
  )
}
