import type { Metadata } from "next"
import CollectionPage from "../components/collection-page"
import CompareDropdown from "../components/compare/compare-dropdown"

export const metadata: Metadata = {
  title: "Dropdown compare prototype",
}

export default function DropdownVariantPage() {
  return <CollectionPage mobileCompare={<CompareDropdown />} />
}
