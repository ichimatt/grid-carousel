import type { Metadata } from "next"
import CompareCourses from "./components/compare"
import Faq from "./components/faq"
import HeroCourses from "./components/hero-courses"
import InsightSections from "./components/insight-sections"

export const metadata: Metadata = {
  title: "Version II",
  description:
    "Second-round wireframe of the collection page: a sticky intro beside a stacked course list, tabbed sections, switchable compare columns, and an FAQ.",
}

export default function VersionTwoPage() {
  return (
    <main>
      <HeroCourses />
      <InsightSections />
      <CompareCourses />
      <Faq />
    </main>
  )
}
