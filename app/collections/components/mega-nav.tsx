import type { CSSProperties } from "react"
import { focusRing } from "./focus-ring"
import {
  linkColumns,
  playbooks,
  playbooksTitle,
  type MegaNavLinkColumn,
  type MegaNavPlaybook,
} from "./mega-nav-data"

/**
 * The desktop mega nav panel (Figma "mega-nav", 1902-29346): four equal
 * columns in the 1360px content width, each a title, a rule and a list; the
 * three link columns close with a second rule and a "View all" link. Every
 * row is a mega-nav-item from the library, 8px by 4px of padding on a 4px
 * radius. Link rows turn the brand pink on hover; playbook rows take their
 * own theme's tint, and the subtitle its theme text. Keyboard focus shows
 * the hover look plus the focus ring. Names that don't fit are cut with an
 * ellipsis, as the 1250px "minimum" frame shows.
 *
 * Rendered on the server; the Explore menu shows and hides it. On short
 * windows it scrolls within the space below the header, stopping short of
 * anything a page floats over its foot (--overlay-bottom), and keeps a
 * focused row 4px clear of its edges so the focus ring isn't cut off. In
 * forced colours, where its shadow is dropped, a rule marks its lower edge.
 */
export default function MegaNav() {
  return (
    <div className="max-h-[calc(100dvh-var(--header-h)-var(--overlay-bottom,0px))] overflow-y-auto overscroll-contain scroll-py-1 bg-white pt-3 pb-6 text-sm/5 font-normal whitespace-nowrap text-ink shadow-elevation-outlined-5 forced-colors:border-b">
      <div className="mx-auto flex w-full max-w-[1360px] items-start gap-6 px-2">
        {linkColumns.map((column, index) => (
          <LinkColumn key={column.title} column={column} id={`mega-nav-column-${index}`} />
        ))}
        <PlaybookColumn id="mega-nav-column-playbooks" />
      </div>
    </div>
  )
}

/** Title, rules, list and footer share the column frame's 12px rhythm. */
function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-1 flex-col gap-3 py-3">{children}</div>
}

/**
 * The "divider" item: a 1px rule inset by the item padding. Drawn as a
 * border, so forced colours keep it.
 */
function Divider() {
  return (
    <div aria-hidden="true" className="px-2 py-1">
      <div className="border-t border-line" />
    </div>
  )
}

/** Shared by the link rows: the brand pink on hover and keyboard focus. */
const linkRow = `rounded-sm px-2 py-1 transition-colors hover:text-primary-text focus-visible:text-primary-text ${focusRing}`

function LinkColumn({ column, id }: { column: MegaNavLinkColumn; id: string }) {
  return (
    <Column>
      {/* The "header-link" item: the title links to the full listing. */}
      <a id={id} href={column.href} className={`truncate font-semibold ${linkRow}`}>
        {column.title}
      </a>
      <Divider />
      <ul role="list" aria-labelledby={id} className="flex flex-col gap-2">
        {column.items.map((item) => (
          <li key={item.label} className="flex">
            {/* The "simple" item. */}
            <a href={item.href} className={`min-w-0 flex-1 truncate ${linkRow}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <Divider />
      {/* The "footer" item: a semibold link with the 2u chevron 4px after it. */}
      <a href={column.footer.href} className={`group flex items-center gap-1 font-semibold ${linkRow}`}>
        <span className="truncate">{column.footer.label}</span>
        {/* Raised 1px: Chrome seats the 2u glyph a pixel lower in its 14px
            line box than Figma does, which centres it on the cap height. */}
        <span
          aria-hidden="true"
          className="relative -top-px font-arrows font-normal leading-none text-ink-secondary transition-colors group-hover:text-primary-text group-focus-visible:text-primary-text"
        >
          {">"}
        </span>
      </a>
    </Column>
  )
}

function PlaybookColumn({ id }: { id: string }) {
  return (
    <Column>
      {/* The "header" item: a plain title, there being no playbook index yet. */}
      <p id={id} className="truncate px-2 py-1 font-semibold">
        {playbooksTitle}
      </p>
      <Divider />
      <ul role="list" aria-labelledby={id} className="flex flex-col gap-2">
        {playbooks.map((playbook) => (
          <PlaybookItem key={playbook.title} playbook={playbook} />
        ))}
      </ul>
    </Column>
  )
}

function PlaybookItem({ playbook }: { playbook: MegaNavPlaybook }) {
  const theme = {
    "--theme-color": playbook.theme.color,
    "--theme-bg": playbook.theme.bg,
    "--theme-text": playbook.theme.text,
  } as CSSProperties

  return (
    <li style={theme} className="flex">
      {/* The "playbook" item: a 1px bar in the theme colour, 4px inside the
          item's padding (8px from the row's edges), then the title over its
          subtitle. */}
      <a
        href={playbook.href}
        className={`group flex min-w-0 flex-1 gap-4 rounded-sm px-2 py-1 transition-colors hover:bg-(--theme-bg) focus-visible:bg-(--theme-bg) ${focusRing}`}
      >
        <span aria-hidden="true" className="flex py-1">
          <span className="w-px rounded-full bg-(--theme-color) forced-colors:bg-[CanvasText]" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-semibold">{playbook.title}</span>
          <span className="truncate text-ink-secondary transition-colors group-hover:text-(--theme-text) group-focus-visible:text-(--theme-text)">
            {playbook.subtitle}
          </span>
        </span>
      </a>
    </li>
  )
}
