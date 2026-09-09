/** Small shared pieces for the version-ii page, matching the first-round prototypes. */

export function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={`text-[23px]/[32px] font-bold tracking-[-0.17px] lg:text-[29px]/[40px] lg:tracking-[-0.29px] ${className}`}
    >
      {children}
    </h2>
  )
}

export function NumberedCircle({
  number,
  active = false,
}: {
  number: number
  active?: boolean
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-9 shrink-0 place-items-center rounded-full border border-wf text-lg/[28px] font-bold tracking-[-0.09px] ${
        active ? "bg-wf text-white" : ""
      }`}
    >
      {number}
    </span>
  )
}
