import type { ReactNode } from "react"
import Container from "./container"

/** A stable, readable id for the heading so the section can be labelled by it. */
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * One supporting section below the springboard (Figma "section",
 * 910:14046 and friends): a hairline rule, then the heading in the first
 * four grid columns and the content in the remaining eight from lg up;
 * stacked on smaller screens. The rule lives inside the Container so it
 * spans the content width on desktop and sits 24px in on mobile.
 */
export default function PageSection({
  title,
  children,
  divider = "always",
  layout = "columns",
  last = false,
}: {
  title: string
  children: ReactNode
  /** Line above the section: on every breakpoint, or only from the desktop grid up. */
  divider?: "always" | "desktop"
  /** "columns" = bullets in two columns from md; "prose" = a single inset text column. */
  layout?: "columns" | "prose"
  /** Extra bottom padding on the last section before the footer (56px on mobile, 128px on desktop). */
  last?: boolean
}) {
  const headingId = `section-${slugify(title)}`

  return (
    <Container>
      <section
        aria-labelledby={headingId}
        className={`border-line pt-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:border-t lg:py-16 ${
          divider === "always" ? "border-t" : ""
        } ${last ? "pb-14 lg:pb-32" : "pb-8"}`}
      >
        <h2
          id={headingId}
          className="max-w-[304px] text-[23px]/8 font-semibold tracking-[-0.17px] text-balance text-ink lg:col-span-4"
        >
          {title}
        </h2>
        {layout === "prose" ? (
          // Figma insets the prose 64px into the content column and a
          // further 20px inside that, capping the text at 672px.
          <div className="mt-6 lg:col-span-8 lg:col-start-5 lg:mt-0 lg:px-16">
            <div className="lg:max-w-[712px] lg:px-5">{children}</div>
          </div>
        ) : (
          // Bullet rows carry their own 28px marker inset, so on small
          // screens they break out of the Container gutter to full width.
          <div className="-mx-6 mt-6 lg:col-span-8 lg:col-start-5 lg:mx-0 lg:mt-0">
            {children}
          </div>
        )}
      </section>
    </Container>
  )
}
