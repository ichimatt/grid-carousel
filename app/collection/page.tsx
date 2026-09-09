import Link from "next/link"
import Container from "./components/container"

const variants = [
  {
    href: "/collection/dropdown",
    name: "1 · Dropdown",
    description:
      "A sticky bar under the fixed header with a dropdown that selects what you're comparing.",
  },
  {
    href: "/collection/tabs",
    name: "2 · Tabs",
    description:
      "A sticky bar with horizontally scrolling tabs that select what you're comparing.",
  },
  {
    href: "/collection/carousel",
    name: "3 · Connected carousel",
    description:
      "Every course's compare cells live in a carousel — sliding one slides all the others.",
  },
  {
    href: "/collection/v2",
    name: "4 · Version II",
    description:
      "Second-round page redesign: a sticky intro beside a stacked course list, tabbed sections, switchable compare columns, and an FAQ.",
  },
]

export default function CollectionHubPage() {
  return (
    <main className="flex flex-1 items-center py-12">
      <Container>
        <h1 className="text-[23px]/[32px] font-bold tracking-[-0.17px] lg:text-[29px]/[40px]">
          Collection page prototypes
        </h1>
        <p className="mt-4 max-w-[615px] text-base/[26px]">
          Three wireframe treatments of the course comparison table on mobile
          — on desktop all three show the same full table — plus a
          second-round redesign of the whole page. Resize the window (or use a
          phone) to compare the mobile behaviour.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {variants.map((variant) => (
            <li key={variant.href}>
              <Link
                href={variant.href}
                className="block h-full rounded-lg border border-wf p-5 transition-colors hover:bg-wf/14"
              >
                <span className="text-lg/[26px] font-bold underline decoration-from-font [text-underline-position:from-font]">
                  {variant.name}
                </span>
                <span className="mt-2 block text-sm/[24px]">
                  {variant.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  )
}
