/** Shared page gutter: 28px on mobile (leaves room for carousel peeks), wider on desktop. */
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-7 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
