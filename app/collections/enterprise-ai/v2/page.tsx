import type { Metadata } from "next"
import type { CSSProperties } from "react"
import Breadcrumb from "../../components/breadcrumb"
import {
  CheckBullets,
  IconBullets,
  NumberedBullets,
} from "../../components/bullets"
import CollectionBlurb from "../../components/collection-blurb"
import CompareSection from "../../components/compare-section"
import Container from "../../components/container"
import ExpandableProse from "../../components/expandable-prose"
import FaqList from "../../components/faq-list"
import PageSection from "../../components/page-section"
import SiteFooter from "../../components/site-footer"
import Springboard from "../../components/springboard"
import {
  collection,
  compareAttributes,
  compareSection,
  courses,
  faq,
  takeBackToWork,
  thinkDifferently,
  whoFor,
  whyDifferent,
} from "./data"

export const metadata: Metadata = {
  title: collection.breadcrumb.current,
  description: collection.intro,
}

/**
 * The version-ii collection page (Figma node 910-14635): a full-width
 * blurb, the course "springboard", six supporting sections and the site
 * footer. The collection's theme colours are set once here and read by
 * every themed piece below.
 */
export default function EnterpriseAiCollectionPageV2() {
  const themeVars = {
    "--theme-color": collection.theme.color,
    "--theme-bg": collection.theme.bg,
    "--theme-text": collection.theme.text,
  } as CSSProperties

  return (
    <>
      <main className="flex-1" style={themeVars}>
        <Container>
          <Breadcrumb
            trail={collection.breadcrumb.trail}
            current={collection.breadcrumb.current}
          />
        </Container>

        <Container className="py-6 desktop:py-8">
          <CollectionBlurb
            collection={collection}
            intro={collection.intro}
            variant="wide"
          />
        </Container>

        <Springboard courses={courses} />

        <PageSection title={thinkDifferently.title} divider="desktop">
          <NumberedBullets items={thinkDifferently.items} />
        </PageSection>

        <PageSection title={takeBackToWork.title}>
          <CheckBullets items={takeBackToWork.items} />
        </PageSection>

        <PageSection title={whoFor.title} layout="prose">
          <ExpandableProse paragraphs={whoFor.paragraphs} />
        </PageSection>

        <CompareSection
          title={compareSection.title}
          intro={compareSection.intro}
          attributes={compareAttributes}
          courses={courses}
        />

        {/* The FAQ carries its own 84px marker gutter, like the bullet lists. */}
        <PageSection title={faq.title}>
          <FaqList items={faq.items} />
        </PageSection>

        <PageSection title={whyDifferent.title} last>
          <IconBullets items={whyDifferent.items} />
        </PageSection>
      </main>
      <SiteFooter />
    </>
  )
}
