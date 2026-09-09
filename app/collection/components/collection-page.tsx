import Container from "./container"
import CourseCards from "./course-cards"
import CompareTable from "./compare/compare-table"
import {
  compareSection,
  hero,
  takeBackToWork,
  thinkDifferently,
  whoFor,
} from "../data"

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[23px]/[32px] font-bold tracking-[-0.17px] lg:text-[29px]/[40px] lg:tracking-[-0.29px]">
      {children}
    </h2>
  )
}

function NumberedCircle({ number }: { number: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 shrink-0 place-items-center rounded-full border border-wf text-lg/[28px] font-bold tracking-[-0.09px]"
    >
      {number}
    </span>
  )
}

/**
 * The Collection page shared by all three prototypes. `mobileCompare` is the
 * variant-specific compare treatment; on desktop every variant shows the same
 * comparison table.
 */
export default function CollectionPage({
  mobileCompare,
}: {
  mobileCompare: React.ReactNode
}) {
  return (
    <main>
      <Container className="pt-6 lg:pt-9">
        <nav aria-label="Breadcrumb" className="text-sm/[21px]">
          <ol className="flex flex-wrap gap-x-3 lg:flex-nowrap">
            <li>
              <a href="#">{hero.breadcrumb.parent}</a>
            </li>
            <li aria-hidden="true">/</li>
            <li className="basis-full font-bold lg:basis-auto" aria-current="page">
              {hero.breadcrumb.current}
            </li>
          </ol>
        </nav>
        <h1 className="mt-9 text-[23px]/[32px] tracking-[-0.17px] lg:mt-12 lg:text-[45px]/[56px] lg:tracking-[-0.68px]">
          {hero.title}
        </h1>
        <p className="mt-6 max-w-[694px] text-base/[26px]">{hero.intro}</p>
      </Container>

      <Container className="mt-9 lg:mt-12">
        <CourseCards />
      </Container>

      <section className="mt-12 bg-wf/14 py-10 lg:mt-16 lg:py-14">
        <Container>
          <SectionHeading>{thinkDifferently.title}</SectionHeading>
          <ol className="mt-8 flex flex-col gap-9 lg:grid lg:grid-cols-4 lg:gap-x-10">
            {thinkDifferently.items.map((item, index) => (
              <li key={index} className="flex items-start gap-5 lg:flex-col">
                <NumberedCircle number={index + 1} />
                <p className="text-base/[26px]">{item}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-12 lg:py-14">
        <Container>
          <SectionHeading>{takeBackToWork.title}</SectionHeading>
          <ol className="mt-8 flex flex-col gap-9 lg:grid lg:grid-cols-5 lg:gap-x-10">
            {takeBackToWork.items.map((item, index) => (
              <li key={index} className="flex items-start gap-5 lg:flex-col">
                <NumberedCircle number={index + 1} />
                <p className="text-base/[26px]">
                  <strong>{item.lead}</strong>
                  {item.rest}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-wf/14 py-10 lg:py-14">
        <Container className="lg:grid lg:grid-cols-[21rem_1fr] lg:gap-x-24">
          <SectionHeading>{whoFor.title}</SectionHeading>
          <div className="mt-6 flex max-w-[615px] flex-col gap-4 lg:mt-0">
            {whoFor.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base/[26px]">
                {"pre" in paragraph && paragraph.pre}
                {"lead" in paragraph && <strong>{paragraph.lead}</strong>}
                {paragraph.rest}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="scroll-mt-(--header-h) py-12 lg:py-16">
        <Container>
          <SectionHeading>{compareSection.title}</SectionHeading>
          <p className="mt-4 text-base/[26px] lg:mt-6">{compareSection.intro}</p>
          <div className="mt-4 hidden lg:mt-8 lg:block">
            <CompareTable />
          </div>
          <div className="mt-2">{mobileCompare}</div>
        </Container>
      </section>
    </main>
  )
}
