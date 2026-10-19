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
 * Explore item. A floating pill offers the prototype's own controls; its
 * footprint (16px from the foot, 40px tall, plus 16px of air) is reserved as
 * --overlay-bottom so the open menu never runs underneath it.
 */
export default function MegaNavPrototypeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${notoSans.variable} font-noto flex min-h-dvh flex-col bg-white text-ink [--header-h:56px] [--overlay-bottom:4.5rem] navbar:[--header-h:104px]`}
    >
      <ExploreMenuControlsProvider>
        <SiteHeader exploreMenu={<MegaNav />} />
        {children}
        <PrototypeControls />
      </ExploreMenuControlsProvider>
    </div>
  )
}
