/**
 * The FAQ body (Figma "faq", nodes 1128:38904 desktop and 1128:38831
 * mobile): each question carries a light, theme-coloured two-digit number
 * in the same 84px marker gutter the bullet lists use, with the answer
 * indented to the question text. The number sits inside the heading so
 * it is part of the question's name. Headings step up from 18px to 23px
 * on the desktop layout. Every answer is shown; there is no accordion.
 */
export default function FaqList({
  items,
}: {
  items: { question: string; answer: string }[]
}) {
  return (
    <ol role="list" className="flex flex-col gap-8 desktop:gap-11">
      {items.map((item, index) => (
        <li
          key={item.question}
          className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-y-4 pr-8"
        >
          <h3 className="col-span-2 grid grid-cols-subgrid text-lg/6 tracking-[-0.09px] desktop:text-[23px]/8 desktop:tracking-[-0.17px]">
            <span className="flex justify-center px-7 font-light text-(--theme-color)">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="max-w-[672px] font-semibold text-ink">{item.question}</span>
          </h3>
          <p className="col-start-2 max-w-[672px] text-base/6 text-ink-secondary">
            {item.answer}
          </p>
        </li>
      ))}
    </ol>
  )
}
