/** The site's breadcrumb strip: 24px above and below a single 37px row. */
export default function Breadcrumb({
  parent,
  current,
}: {
  parent: string
  current: string
}) {
  return (
    <nav aria-label="Breadcrumb" className="py-6 text-sm/[21px]">
      <ol className="flex flex-wrap items-center py-2">
        <li>
          <a
            href="#"
            className="text-ink-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {parent}
          </a>
        </li>
        <li aria-hidden="true" className="px-3 text-[#212529]">
          /
        </li>
        <li className="font-bold" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}
