import type { Metadata } from "next"
import CollectionPage from "../components/collection-page"
import CompareTabs from "../components/compare/compare-tabs"

export const metadata: Metadata = {
  title: "Tabs compare prototype",
}

export default function TabsVariantPage() {
  return <CollectionPage mobileCompare={<CompareTabs />} />
}
