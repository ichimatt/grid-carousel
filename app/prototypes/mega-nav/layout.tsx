import type { Metadata } from "next"
import { ExploreMenuControlsProvider } from "../../collections/components/explore-menu-context"
import MegaNav from "../../collections/components/mega-nav"
import SiteHeader from "../../collections/components/site-header"
import { notoSans } from "../../collections/fonts"
import PrototypeControls from "./prototype-controls"

export const metadata: Metadata = {
  title: "Mega nav prototype · GetSmarter",
  description:
    "Prototype of the redesigned desktop mega nav, with the new Playbooks column, in the GetSmarter header.",
}

/**
 * The hi-fi page chrome with the redesigned mega nav wired into the header's
 * Explore item. A floating panel offers the prototype's own controls.
 */
export default function MegaNavPrototypeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${notoSans.variable} font-noto flex min-h-dvh flex-col bg-white text-ink [--header-h:56px] navbar:[--header-h:104px]`}
    >
      <ExploreMenuControlsProvider>
        <SiteHeader exploreMenu={<MegaNav />} />
        {children}
        <PrototypeControls />
      </ExploreMenuControlsProvider>
    </div>
  )
}
