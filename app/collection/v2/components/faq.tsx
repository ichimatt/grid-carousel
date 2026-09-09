import Container from "../../components/container"
import { faq } from "../data"
import { SectionHeading } from "./ui"

/** FAQ: heading beside the questions on desktop, stacked on mobile. */
export default function Faq() {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="border-t border-wf/40 pt-10 lg:grid lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-x-24 lg:pt-14">
          <SectionHeading>{faq.title}</SectionHeading>
          <div className="mt-8 flex max-w-[43rem] flex-col gap-9 lg:mt-0">
            {faq.items.map((item) => (
              <div key={item.question}>
                <h3 className="text-base/[26px] font-bold">{item.question}</h3>
                <p className="mt-2 text-base/[26px]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
