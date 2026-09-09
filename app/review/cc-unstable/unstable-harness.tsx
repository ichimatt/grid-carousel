"use client"

import { useEffect, useState } from "react"
import CollectionCarousel from "../../components/collection-carousel/collection-carousel"

/** TEMPORARY review harness: parent re-renders every 50ms and passes an inline labels object. */
export function UnstableHarness() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 50)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div data-ticks={tick} className="w-[1512px] shrink-0 overflow-clip rounded-lg">
      <CollectionCarousel label="unstable" labels={{ cta: "Explore the collection" }} />
    </div>
  )
}
