import type { Metadata } from "next"
import CollectionPage from "../components/collection-page"
import CompareConnected from "../components/compare/compare-connected"

export const metadata: Metadata = {
  title: "Connected-carousel compare prototype",
}

export default function CarouselVariantPage() {
  return <CollectionPage mobileCompare={<CompareConnected />} />
}
