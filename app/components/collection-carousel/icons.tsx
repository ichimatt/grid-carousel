import type { SVGProps } from "react"

/**
 * Inline icons from the design's lucide set, geometry lifted from the Figma
 * exports. Every stroke is currentColor so they theme with their button.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children">

function Icon({
  size = 16,
  children,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 12L6 8L10 4" />
    </Icon>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 12L10 8L6 4" />
    </Icon>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2H10C9.63181 2 9.33333 2.29848 9.33333 2.66667V13.3333C9.33333 13.7015 9.63181 14 10 14H12C12.3682 14 12.6667 13.7015 12.6667 13.3333V2.66667C12.6667 2.29848 12.3682 2 12 2Z" />
      <path d="M6 2H4C3.63181 2 3.33333 2.29848 3.33333 2.66667V13.3333C3.33333 13.7015 3.63181 14 4 14H6C6.36819 14 6.66667 13.7015 6.66667 13.3333V2.66667C6.66667 2.29848 6.36819 2 6 2Z" />
    </Icon>
  )
}

/** Not in the design (which only shows the playing state); lucide's play glyph at 16px. */
export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 2.5L13.5 8L4 13.5V2.5Z" />
    </Icon>
  )
}

/** The button's trailing chevron: a 20px lucide chevron-right at 1.67px. */
export function ButtonChevronIcon(props: IconProps) {
  return (
    <Icon size={20} strokeWidth={1.66667} {...props}>
      <path d="M7.5 15L12.5 10L7.5 5" />
    </Icon>
  )
}
