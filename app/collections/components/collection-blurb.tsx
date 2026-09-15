import type { CSSProperties } from "react"
import type { Collection } from "@/app/components/collection-carousel/collections"

/**
 * The collection's intro: themed kicker tag and course count, the title, and
 * the blurb. The tag border and kicker text take the collection's theme
 * colours through CSS variables, as the collection carousel does.
 */
export default function CollectionBlurb({
  collection,
  intro,
  className = "",
}: {
  collection: Collection
  intro: string
  className?: string
}) {
  const themeVars = {
    "--theme-color": collection.theme.color,
    "--theme-text": collection.theme.text,
  } as CSSProperties

  return (
    <div className={`flex flex-col gap-4 ${className}`} style={themeVars}>
      <p className="flex items-center gap-3 text-sm/5 text-(--theme-text)">
        <span className="flex h-7 items-center rounded-[3px] border border-(--theme-color) px-2">
          {collection.kicker}
        </span>
        <span>{collection.courseCount}</span>
      </p>
      <h1 className="text-[26px]/9 font-semibold tracking-[-0.26px] text-balance lg:text-[37px]/12 lg:tracking-[-0.46px]">
        {collection.title}
      </h1>
      <p className="text-base/6">{intro}</p>
    </div>
  )
}
