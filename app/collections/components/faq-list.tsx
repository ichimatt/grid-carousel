/**
 * The FAQ section body (Figma 910:14483 / 910:12626): every answer is shown
 * under its question, no accordion. Questions are h3s so the outline reads
 * section → question.
 */
export default function FaqList({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  return (
    <ul role="list" className="flex flex-col gap-8 lg:gap-11">
      {items.map((item) => (
        <li key={item.question} className="flex max-w-[672px] flex-col gap-2">
          <h3 className="text-base/6 font-semibold text-ink">{item.question}</h3>
          <p className="text-base/6 text-ink">{item.answer}</p>
        </li>
      ))}
    </ul>
  )
}
