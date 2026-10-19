import type { CSSProperties } from "react"
import { focusRing } from "./focus-ring"
import {
  drawnTheme,
  linkColumns,
  playbooks,
  playbooksTitle,
  type MegaNavLinkColumn,
  type MegaNavPlaybook,
} from "./mega-nav-data"

/**
 * The desktop mega nav panel (Figma "mega-nav", 1900-27837): four equal
 * columns in the 1360px content width, each a title, a rule and a list.
 * Every row is a mega-nav-item from the library, 8px by 4px of padding on
 * a 4px radius. Link rows turn the brand pink on hover; playbook rows take
 * their theme's tint, and the subtitle its theme text. Keyboard focus shows
 * the hover look plus the focus ring. Names that don't fit are cut with an
 * ellipsis, as the 1250px "minimum" frame shows.
 *
 * Rendered on the server; the Explore menu shows and hides it. On short
 * windows it scrolls within the space below the header.
 */
export default function MegaNav() {
  return (
    <div className="max-h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain bg-white pt-3 pb-10 text-sm/5 font-normal whitespace-nowrap text-ink shadow-elevation-outlined-5">
      <div className="mx-auto flex w-full max-w-[1360px] items-start gap-6 px-2">
        {linkColumns.map((column, index) => (
          <LinkColumn key={column.title} column={column} id={`mega-nav-column-${index}`} />
        ))}
        <PlaybookColumn id="mega-nav-column-playbooks" />
      </div>
    </div>
  )
}

/** Title, rule and list share the column frame's 12px rhythm. */
function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-1 flex-col gap-3 py-3">{children}</div>
}

/** The "divider" item: a 1px rule inset by the item padding. */
function Divider() {
  return (
    <div aria-hidden="true" className="px-2 py-1">
      <div className="h-px bg-line" />
    </div>
  )
}

function LinkColumn({ column, id }: { column: MegaNavLinkColumn; id: string }) {
  return (
    <Column>
      {/* The "header-link" item: the title links to the full listing, with
          the 2u chevron 4px after it. */}
      <a
        id={id}
        href={column.href}
        className={`group flex items-center gap-1 rounded-sm px-2 py-1 font-semibold transition-colors hover:text-primary-text focus-visible:text-primary-text ${focusRing}`}
      >
        <span className="truncate">{column.title}</span>
        {/* Raised 1px: Chrome seats the 2u glyph a pixel lower in its 14px
            line box than Figma does, which centres it on the cap height. */}
        <span
          aria-hidden="true"
          className="relative -top-px font-arrows font-normal leading-none text-ink-secondary transition-colors group-hover:text-primary-text group-focus-visible:text-primary-text"
        >
          {">"}
        </span>
      </a>
      <Divider />
      <ul role="list" aria-labelledby={id} className="flex flex-col gap-2">
        {column.items.map((item) => (
          <li key={item.label} className="flex">
            {/* The "simple" item. */}
            <a
              href={item.href}
              className={`min-w-0 flex-1 truncate rounded-sm px-2 py-1 transition-colors hover:text-primary-text focus-visible:text-primary-text ${focusRing}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Column>
  )
}

function PlaybookColumn({ id }: { id: string }) {
  // As drawn, every row shares the default theme. The prototype's "own
  // colours" switch sets data-playbook-colours="own" on the panel, and each
  // row then swaps in its own playbook's theme.
  const drawn = {
    "--theme-color": drawnTheme.color,
    "--theme-bg": drawnTheme.bg,
    "--theme-text": drawnTheme.text,
  } as CSSProperties

  return (
    <Column>
      {/* The "header" item: a plain title, there being no playbook index yet. */}
      <p id={id} className="truncate px-2 py-1 font-semibold">
        {playbooksTitle}
      </p>
      <Divider />
      <ul role="list" aria-labelledby={id} className="flex flex-col gap-2" style={drawn}>
        {playbooks.map((playbook) => (
          <PlaybookItem key={playbook.title} playbook={playbook} />
        ))}
      </ul>
    </Column>
  )
}

function PlaybookItem({ playbook }: { playbook: MegaNavPlaybook }) {
  const own = {
    "--own-color": playbook.theme.color,
    "--own-bg": playbook.theme.bg,
    "--own-text": playbook.theme.text,
  } as CSSProperties

  return (
    <li
      style={own}
      className="flex in-data-[playbook-colours=own]:[--theme-bg:var(--own-bg)] in-data-[playbook-colours=own]:[--theme-color:var(--own-color)] in-data-[playbook-colours=own]:[--theme-text:var(--own-text)]"
    >
      {/* The "playbook" item: a 1px bar in the theme colour, 4px inside the
          item's padding (8px from the row's edges), then the title over its
          subtitle. */}
      <a
        href={playbook.href}
        className={`group flex min-w-0 flex-1 gap-4 rounded-sm px-2 py-1 transition-colors hover:bg-(--theme-bg) focus-visible:bg-(--theme-bg) ${focusRing}`}
      >
        <span aria-hidden="true" className="flex py-1">
          <span className="w-px rounded-full bg-(--theme-color)" />
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
