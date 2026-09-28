/**
 * Page gutter and content cap. Below the desktop layout the content is a
 * single 672px column (24px gutters, centred once the viewport is wider);
 * from 1040px it widens to 1360px with 40px gutters.
 */
export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[672px] px-6 desktop:max-w-[1440px] desktop:px-10 ${className}`}
    >
      {children}
    </div>
  )
}
