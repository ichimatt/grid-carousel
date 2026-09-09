import type { GraphicName } from "./collection-graphics"

/**
 * The six course collections shown in the hi-fi carousel, copy and theme
 * values lifted from the Course-collections Figma library. Each theme is the
 * collection's Figma variable set (theme-color, theme-bg, theme-text) and is
 * applied to the slide as CSS custom properties, which the gradient, kicker
 * and inline graphic all read.
 */
export type CollectionTheme = {
  /** Accent used by the graphic and, at 10%, the mobile gradient. */
  color: string
  /** Desktop gradient start. */
  bg: string
  /** Kicker text colour. */
  text: string
}

export type Collection = {
  slug: string
  kicker: string
  courseCount: string
  title: string
  blurb: string
  href: string
  graphic: GraphicName
  theme: CollectionTheme
}

export const collections: Collection[] = [
  {
    slug: "enterprise-ai",
    kicker: "Enterprise AI",
    courseCount: "5 MIT courses",
    title: "Turn AI into business results",
    blurb:
      "Everyone has run a pilot. Almost nobody has changed how the business actually works.",
    href: "#",
    graphic: "hub",
    theme: { color: "#9a4144", bg: "#fef2f0", text: "#720119" },
  },
  {
    slug: "responsible-ai",
    kicker: "Responsible AI",
    courseCount: "5 courses",
    title: "Use AI responsibly",
    blurb:
      "Programmes on where AI is defensible, where it isn’t, and how to tell the difference.",
    href: "#",
    graphic: "network",
    theme: { color: "#046971", bg: "#edf8f6", text: "#02434b" },
  },
  {
    slug: "management",
    kicker: "Management",
    courseCount: "5 courses",
    title: "Lead beyond your function",
    blurb:
      "Strategy, finance, delivery and general management. The capabilities that outlast every disruption.",
    href: "#",
    graphic: "arrowhead",
    theme: { color: "#0b6b47", bg: "#f1f7f0", text: "#024630" },
  },
  {
    slug: "leadership",
    kicker: "Leadership",
    courseCount: "5 courses",
    title: "Step up to senior leadership",
    blurb:
      "Programmes on leading other leaders, influencing decisions, and negotiating what you need.",
    href: "#",
    graphic: "staircase",
    theme: { color: "#815503", bg: "#f8f5eb", text: "#543201" },
  },
  {
    slug: "healthcare",
    kicker: "Healthcare",
    courseCount: "5 courses",
    title: "Go beyond medical school",
    blurb:
      "Nutrition, AI and running a department. The three things nobody prepared you for.",
    href: "#",
    graphic: "healthcare",
    theme: { color: "#67509c", bg: "#f8f3fc", text: "#3e247c" },
  },
  {
    slug: "public-policy",
    kicker: "Public policy",
    courseCount: "5 LSE courses",
    title: "Move policy forward",
    blurb:
      "Public institutions are being asked to do more, with less, faster, and in full view.",
    href: "#",
    graphic: "equaliser",
    theme: { color: "#99442e", bg: "#fdf3ed", text: "#710801" },
  },
]
