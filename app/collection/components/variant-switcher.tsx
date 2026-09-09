"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const variants = [
  { href: "/collection/dropdown", label: "Dropdown" },
  { href: "/collection/tabs", label: "Tabs" },
  { href: "/collection/carousel", label: "Carousel" },
  { href: "/collection/v2", label: "Version II" },
]

/**
 * Floating switcher between the wireframe prototypes. Hidden on the v2
 * redesign, which stands on its own rather than being one of the
 * side-by-side compare treatments.
 */
export default function VariantSwitcher() {
  const pathname = usePathname()
  if (pathname === "/collection/v2") return null

  return (
    <nav
      aria-label="Prototype variants"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <ul className="flex items-center gap-1 rounded-full border border-wf bg-white p-1 shadow-[0_4px_16px_rgba(80,86,199,0.35)]">
        <li
          aria-hidden="true"
          className="pl-3 pr-1 text-[11px] font-bold uppercase tracking-wider text-wf/70"
        >
          Wireframe
        </li>
        {variants.map((variant) => {
          const active = pathname === variant.href
          return (
            <li key={variant.href}>
              <Link
                href={variant.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-full px-3 py-1 text-sm ${
                  active ? "bg-wf font-bold text-white" : "text-wf"
                }`}
              >
                {variant.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
