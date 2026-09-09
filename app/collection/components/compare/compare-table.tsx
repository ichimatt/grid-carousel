import { compareAttributes, courses } from "../../data"

/**
 * The desktop comparison table. All three prototypes share it — the variants
 * only differ in how the table collapses on small screens.
 */
export default function CompareTable() {
  // Sticky must sit on the th cells (not thead), and the underline on the
  // cells too — collapsed row borders don't travel with sticky cells.
  const stickyHeader =
    "sticky top-(--header-h) z-10 border-b border-wf bg-white pt-3 pb-3 pr-8 text-base/[26px] font-bold"

  return (
    <table className="w-full border-separate border-spacing-0 text-left">
      <thead>
        <tr>
          <th scope="col" className={`w-[23%] ${stickyHeader}`}>
            Course
          </th>
          {compareAttributes.map((attribute) => (
            <th
              key={attribute.key}
              scope="col"
              className={`${attribute.key === "price" ? "w-[15%]" : "w-[20.5%]"} ${stickyHeader}`}
            >
              {attribute.label}
            </th>
          ))}
        </tr>
      </thead>
      {courses.map((course) => (
        <tbody key={course.slug}>
          <tr>
            <th scope="colgroup" colSpan={5} className="pt-3 font-normal">
              <div className="flex h-[33px] items-center bg-wf/20 px-2 text-sm/[26px]">
                {course.stage}
              </div>
            </th>
          </tr>
          <tr className="align-top">
            <th scope="row" className="py-3 pr-8 font-normal">
              <a
                href="#"
                className="text-base/[26px] font-bold underline decoration-solid decoration-from-font [text-underline-position:from-font]"
              >
                {course.title}
              </a>
              <p className="text-sm/[26px]">{course.provider}</p>
            </th>
            <td className="py-3 pr-8 text-base/[26px]">{course.compare.chooseWhen}</td>
            <td className="py-3 pr-8 text-base/[26px]">{course.compare.leaveWith}</td>
            <td className="py-3 pr-8 text-base/[26px]">{course.compare.bestIf}</td>
            <td className="py-3 text-base/[26px]">
              <p className="font-bold">{course.price}</p>
              <p>{course.duration}</p>
              <p className="opacity-80">{course.hoursPerWeek}</p>
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  )
}
