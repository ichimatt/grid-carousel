import type { ReactNode } from "react"
import type { Bullet } from "../types"

/**
 * Bullet lists for the supporting sections (Figma "bullets"): one column on
 * small screens, two from md up. The design stacks each column
 * independently (source order fills the first column, then the second),
 * which a grid cannot do without equalising row heights, so the list is a
 * two-column multicol with a forced break after the first half.
 */
function BulletList({
  as: List,
  keys,
  renderMarker,
  renderText,
}: {
  as: "ol" | "ul"
  /** One stable key per item, in order. */
  keys: string[]
  renderMarker: (index: number) => ReactNode
  renderText: (index: number) => ReactNode
}) {
  const count = keys.length
  const lastInFirstColumn = Math.ceil(count / 2) - 1
  return (
    // role="list" keeps list semantics in Safari once list-style is removed.
    <List
      role="list"
      className="flex flex-col gap-y-6 md:block md:columns-2 md:gap-x-8"
    >
      {keys.map((key, index) => {
        const endsColumn = index === lastInFirstColumn || index === count - 1
        return (
          <li
            key={key}
            className={`flex items-start pr-8 md:break-inside-avoid ${
              // The last item of each column carries no trailing margin, or
              // the taller column would end 32px below its text.
              endsColumn ? "" : "md:mb-8"
            } ${index === lastInFirstColumn ? "md:break-after-column" : ""}`}
          >
            <span className="shrink-0 px-7">
              <span className="block px-0.5">{renderMarker(index)}</span>
            </span>
            <p className="min-w-0 flex-1 text-base/6 text-ink">
              {renderText(index)}
            </p>
          </li>
        )
      })}
    </List>
  )
}

/** Numbered points: a themed 24px disc carrying the item's own number. */
export function NumberedBullets({ items }: { items: string[] }) {
  return (
    <BulletList
      as="ol"
      keys={items}
      renderMarker={(index) => (
        // Read out as well as shown: the <ol> has no visible marker of its
        // own once list-style is removed.
        <span className="flex size-6 items-center justify-center rounded-full bg-(--theme-color) text-sm/5 font-bold text-white">
          {index + 1}
        </span>
      )}
      renderText={(index) => items[index]}
    />
  )
}

/** Checked points with a bold lead-in: a lucide check in the theme colour. */
export function CheckBullets({ items }: { items: Bullet[] }) {
  return (
    <BulletList
      as="ul"
      keys={items.map((item) => `${item.lead ?? ""}${item.rest}`)}
      renderMarker={() => (
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block text-(--theme-color)"
        >
          <path d="M20 6L9 17L4 12" />
        </svg>
      )}
      renderText={(index) => {
        const { lead, rest } = items[index]
        return (
          <>
            {lead && <strong className="font-semibold">{lead}</strong>}
            {rest}
          </>
        )
      }}
    />
  )
}
