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
 * 1128:34663 and friends): a hairline rule, then the heading in the first
 * four grid columns and the content in the remaining eight on the desktop
 * layout; stacked with 32px of breathing room on smaller screens. The rule
 * lives inside the Container so it spans the content width on desktop and
 * sits 24px in on mobile.
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
  /** Extra bottom padding on the last section before the footer (64px on mobile, 128px on desktop). */
  last?: boolean
}) {
  const headingId = `section-${slugify(title)}`

  return (
    <Container>
      <section
        aria-labelledby={headingId}
        className={`border-line pt-8 desktop:grid desktop:grid-cols-12 desktop:gap-x-8 desktop:border-t desktop:py-16 ${
          divider === "always" ? "border-t" : ""
        } ${last ? "pb-16 desktop:pb-32" : "pb-12"}`}
      >
        <h2
          id={headingId}
          className="max-w-[304px] text-[23px]/8 font-semibold tracking-[-0.17px] text-balance text-ink desktop:col-span-4"
        >
          {title}
        </h2>
        {layout === "prose" ? (
          // Figma insets the prose 64px into the content column and a
          // further 20px inside that, capping the text at 672px.
          <div className="mt-8 desktop:col-span-8 desktop:col-start-5 desktop:mt-0 desktop:px-16">
            <div className="desktop:max-w-[712px] desktop:px-5">{children}</div>
          </div>
        ) : (
          // Bullet rows carry their own 28px marker inset, so on small
          // screens they break out of the Container gutter to full width.
          <div className="-mx-6 mt-8 desktop:col-span-8 desktop:col-start-5 desktop:mx-0 desktop:mt-0">
            {children}
          </div>
        )}
      </section>
    </Container>
  )
}
