/**
 * Pieces the navigation bar's items share, static or interactive: the live
 * site's hover ground and the Explore chevron.
 */

/** getsmarter.com darkens a navigation-bar item behind the pointer. */
export const navLinkHover = "transition-colors hover:bg-[#06101a]"

export function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m3 5.5 5 5 5-5" />
    </svg>
  )
}
