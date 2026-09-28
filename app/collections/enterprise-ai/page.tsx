import type { Metadata } from "next"
import Breadcrumb from "../components/breadcrumb"
import CollectionBlurb from "../components/collection-blurb"
import CollectionItem from "../components/collection-item"
import Container from "../components/container"
import styles from "./collection.module.css"
import { collection, courses } from "./data"

export const metadata: Metadata = {
  title: collection.breadcrumb.current,
  description: collection.intro,
}

/**
 * The hi-fi collection page's opening section: the collection blurb beside
 * (desktop) or above (mobile) the list of courses in the collection.
 */
export default function EnterpriseAiCollectionPage() {
  return (
    <main className="flex-1">
      <Container>
        <Breadcrumb
          trail={collection.breadcrumb.trail}
          current={collection.breadcrumb.current}
        />
      </Container>

      <Container className="desktop:py-10">
        <div className="desktop:grid desktop:grid-cols-[minmax(18rem,1fr)_minmax(0,780px)] desktop:items-start desktop:gap-x-8">
          <div className={styles.stage}>
            <CollectionBlurb
              collection={collection}
              intro={collection.intro}
              className="desktop:max-w-96"
            />
          </div>

          {/* Mobile: the list runs 12px from the viewport edge, inside the
              24px page gutter, with 32px above and below. */}
          <section
            aria-labelledby="collection-courses"
            className="-mx-3 mt-6 py-8 desktop:m-0 desktop:p-0"
          >
            <h2 id="collection-courses" className="sr-only">
              Courses in this collection
            </h2>
            <ol className="flex flex-col gap-4 desktop:gap-8">
              {courses.map((course) => (
                <CollectionItem key={course.slug} course={course} />
              ))}
            </ol>
          </section>
        </div>
      </Container>
    </main>
  )
}
