import { collections } from "../collection-carousel/collections"
import type { ConstrainedGraphicName } from "./constrained-graphics"

/**
 * The steps of a collection's colour ramp the tile uses, named as the Figma
 * library names them: theme-50 for the tinted ground, 200/300/400 for the
 * symbol, 800 for the collection name and its links.
 */
export type CollectionTileTheme = {
  bg: string
  symbolLight: string
  symbol: string
  symbolDark: string
  text: string
}

export type CollectionTileData = {
  slug: string
  /** The collection's name, shown as the kicker. */
  name: string
  headline: string
  courseCount: string
  /** Call to action, shown only by the full-width landscape variant. */
  cta: string
  href: string
  graphic: ConstrainedGraphicName
  theme: CollectionTileTheme
}

const bySlug = new Map(collections.map((collection) => [collection.slug, collection]))

/** A tile for one collection: its link, plus this design's copy, symbol and ramp. */
function tile(
  slug: string,
  name: string,
  headline: string,
  courseCount: string,
  graphic: ConstrainedGraphicName,
  theme: CollectionTileTheme
): CollectionTileData {
  const base = bySlug.get(slug)
  if (!base) throw new Error(`Unknown collection "${slug}"`)
  return { slug, name, headline, courseCount, cta: "View playbook", href: base.href, graphic, theme }
}

/**
 * The six tiles from the Figma "collection tile responsiveness" frames, in
 * order, with the ramps their themed instances resolve to (crimson, teal,
 * sage, gold, cobalt, coral).
 */
export const collectionTiles: CollectionTileData[] = [
  tile("enterprise-ai", "AI for Executives", "Turn AI into business results", "5 MIT courses", "eye", {
    bg: "#fef2f0", symbolLight: "#fdc9c1", symbol: "#fca59b", symbolDark: "#dd807d", text: "#720119",
  }),
  tile("responsible-ai", "Responsible AI", "Implement AI responsibly", "5 courses", "ring", {
    bg: "#edf8f6", symbolLight: "#b1e3df", symbol: "#6ecbca", symbolDark: "#44b1b4", text: "#02434b",
  }),
  tile("management", "General management", "Lead beyond your function", "5 courses", "play", {
    bg: "#f1f7f0", symbolLight: "#c3e1c4", symbol: "#90ca9a", symbolDark: "#6eb080", text: "#024630",
  }),
  tile("leadership", "Executive Leadership", "Step up to senior leadership", "5 courses", "blocks", {
    bg: "#f8f5eb", symbolLight: "#e9d6ab", symbol: "#ddb86b", symbolDark: "#c39641", text: "#543201",
  }),
  tile("healthcare", "Practical Healthcare", "Cover medical school’s gaps", "5 courses", "plus", {
    bg: "#f0f6fe", symbolLight: "#c2d9fe", symbol: "#9cbdfe", symbolDark: "#7f9ce6", text: "#302a80",
  }),
  tile("public-policy", "Public policy", "Move policy forward", "5 LSE courses", "books", {
    bg: "#fdf3ed", symbolLight: "#facdb5", symbol: "#f7aa84", symbolDark: "#da8563", text: "#710801",
  }),
]
