import { focusRing } from "./focus-ring"

/**
 * The site's breadcrumb strip: 24px above and below rows of 21px. Each
 * ancestor is grouped with its trailing slash so a wrap on narrow screens
 * never strands a separator at the start of a line.
 */
export default function Breadcrumb({
  trail,
  current,
}: {
  /** Ancestors from the home page down, excluding the current page. */
  trail: string[]
  current: string
}) {
  return (
    <nav aria-label="Breadcrumb" className="py-6 text-sm/[21px]">
      <ol className="flex flex-wrap items-center py-2">
        {trail.map((label) => (
          <li key={label} className="flex items-center">
            {/* Vertical padding lifts the 21px row to a 24px target without
                changing the row height. */}
            <a
              href="#"
              className={`-my-0.5 inline-block rounded-xs py-0.5 text-ink-secondary ${focusRing}`}
            >
              {label}
            </a>
            <span aria-hidden="true" className="w-[30px] text-center text-[#212529]">
              /
            </span>
          </li>
        ))}
        <li className="font-bold" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}
