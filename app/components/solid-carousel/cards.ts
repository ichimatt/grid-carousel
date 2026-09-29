import { collections } from "../collection-carousel/collections"
import type { GraphicName } from "../collection-carousel/collection-graphics"

/**
 * A collection's colour ramp from the Course-collections Figma library (its
 * ramp/theme-* variables), named for what the solid card does with each step.
 */
export type SolidCardRamp = {
  /** theme-800: the tile itself. */
  tile: string
  /** theme-700: the graphic's faint guide lines, drawn at 69%. */
  guide: string
  /** theme-500: the graphic's hairlines and hollow dots. */
  line: string
  /** theme-300: the graphic's solid dots. */
  dot: string
  /** theme-100: the course-count row. */
  kicker: string
}

export type SolidCardData = {
  slug: string
  title: string
  courseCount: string
  href: string
  graphic: GraphicName
  ramp: SolidCardRamp
}

const bySlug = new Map(collections.map((collection) => [collection.slug, collection]))

/** A card for one collection: its link and graphic, plus this design's copy and ramp. */
function card(slug: string, title: string, courseCount: string, ramp: SolidCardRamp): SolidCardData {
  const base = bySlug.get(slug)
  if (!base) throw new Error(`Unknown collection "${slug}"`)
  return { slug, title, courseCount, href: base.href, graphic: base.graphic, ramp }
}

/**
 * The six cards of the solid carousel (Figma section "solid-carousel"), in
 * the order they appear. Each ramp is read from the card instance's own
 * variables; the mobile and desktop frames agree on them.
 */
export const solidCards: SolidCardData[] = [
  card("enterprise-ai", "Turn AI into business results", "5 MIT courses", { tile: "#720119", guide: "#822b31", line: "#bd6062", dot: "#fca59b", kicker: "#fde5e0" }),
  card("responsible-ai", "Implement AI responsibly", "5 courses", { tile: "#630f56", guide: "#742e63", line: "#b16191", dot: "#f4a4c8", kicker: "#fce4ec" }),
  card("management", "Lead beyond your function", "5 courses", { tile: "#3e247c", guide: "#513d88", line: "#8b6ebd", dot: "#d0aef5", kicker: "#f1e6f9" }),
  card("leadership", "Step up to senior leadership", "5 courses", { tile: "#02434b", guide: "#035861", line: "#069299", dot: "#6ecbca", kicker: "#daf1ee" }),
  card("healthcare", "Cover medical school’s gaps", "5 courses", { tile: "#302a80", guide: "#3e438d", line: "#667bc8", dot: "#9cbdfe", kicker: "#e0ecfe" }),
  card("public-policy", "Move policy forward", "5 LSE courses", { tile: "#710801", guide: "#822d1d", line: "#bc6547", dot: "#f7aa84", kicker: "#fce6db" }),
]

/** The placeholder the library component shows, used to document states. */
export const sampleSolidCard: SolidCardData = {
  ...solidCards[0],
  slug: "sample",
  title: "Course headline",
  courseCount: "5 courses",
}
