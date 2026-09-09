import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"

// The hi-fi components use Noto Sans Regular, Medium and SemiBold.
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Component review",
    template: "%s · Component review",
  },
  description:
    "High-fidelity components rendered at every breakpoint side by side for stakeholder review.",
}

export default function ReviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${notoSans.variable} font-noto min-h-dvh bg-sunken text-ink`}>
      {children}
    </div>
  )
}
