/** Page gutter: 24px on small screens, 40px from the two-column layout up, content capped at 1360px. */
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
