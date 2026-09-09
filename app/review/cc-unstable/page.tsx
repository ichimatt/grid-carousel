import CollectionCarousel from "../../components/collection-carousel/collection-carousel"
import { UnstableHarness } from "./unstable-harness"

/** TEMPORARY review page for reproducing the effect-cleanup pending-lock claim. */
export default function UnstableReviewPage() {
  return (
    <main className="flex flex-col gap-12 px-6 py-10">
      <div className="overflow-x-auto pb-2">
        <div className="w-[1512px] shrink-0 overflow-clip rounded-lg">
          <CollectionCarousel label="stable" />
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <UnstableHarness />
      </div>
    </main>
  )
}
