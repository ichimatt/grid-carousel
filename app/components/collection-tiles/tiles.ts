import { collections, type Collection } from "../collection-carousel/collections"

/**
 * The tile carousel's copy and order from the handover frame. Theme colours,
 * graphics and links come from the collection they belong to.
 */
export type CollectionTileData = Pick<
  Collection,
  "slug" | "title" | "courseCount" | "href" | "graphic" | "theme"
>

const bySlug = new Map(collections.map((collection) => [collection.slug, collection]))

function tile(slug: string, title: string, courseCount: string): CollectionTileData {
  const base = bySlug.get(slug)
  if (!base) throw new Error(`Unknown collection "${slug}"`)
  return { slug, title, courseCount, href: base.href, graphic: base.graphic, theme: base.theme }
}

export const collectionTiles: CollectionTileData[] = [
  tile("enterprise-ai", "Turn AI into business results", "5 MIT courses"),
  tile("responsible-ai", "Implement AI responsibly", "4 courses"),
  tile("leadership", "Step up to senior leadership", "5 courses"),
  tile("management", "Lead beyond your function", "5 courses"),
  tile("healthcare", "Cover medical school’s gaps", "5 courses"),
  tile("public-policy", "Move policy forward", "5 LSE courses"),
]

/** The placeholder tile the handover uses to document interactive states. */
export const sampleTile: CollectionTileData = tile("healthcare", "Course headline", "5 courses")
