import type { Metadata } from "next"
import SiteHeader from "./components/site-header"
import { notoSans } from "./fonts"

export const metadata: Metadata = {
  title: {
    default: "Course collections · GetSmarter",
    template: "%s · GetSmarter",
  },
  description:
    "High-fidelity prototype of the GetSmarter course-collection page.",
}

/**
 * Chrome for the hi-fi collection pages: the live GetSmarter header (sticky,
 * 56px until the desktop bars appear at 1250px) above a white page. The
 * header height is exposed as --header-h so sticky content can sit below it.
 */
export default function CollectionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${notoSans.variable} font-noto flex min-h-dvh flex-col bg-white text-ink [--header-h:56px] navbar:[--header-h:104px]`}
    >
      <SiteHeader />
      {children}
    </div>
  )
}
