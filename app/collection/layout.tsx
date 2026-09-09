import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import SiteHeader from "./components/site-header"
import SiteFooter from "./components/site-footer"
import VariantSwitcher from "./components/variant-switcher"

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: "Artificial Intelligence collection · GetSmarter wireframe",
    template: "%s · GetSmarter wireframe",
  },
  description:
    "Wireframe prototypes for the GetSmarter course-collection page: three mobile treatments of the course comparison table, plus a second-round redesign of the whole page.",
}

export default function CollectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${notoSans.variable} font-noto flex min-h-dvh flex-col overflow-x-clip bg-white text-wf [--header-h:56px] lg:[--header-h:104px]`}
    >
      <SiteHeader />
      {/* The header is fixed, so the page starts below it. */}
      <div className="flex flex-1 flex-col pt-(--header-h)">{children}</div>
      <SiteFooter />
      <VariantSwitcher />
    </div>
  )
}
