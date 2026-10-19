import { Noto_Sans } from "next/font/google"

/**
 * Noto Sans for the hi-fi pages and prototypes. It is a variable font on
 * Google Fonts, so one face per style covers the Light Italic search
 * placeholder through the Bold breadcrumb. Defined once so every layout
 * that uses it shares the same font files.
 */
export const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
})
