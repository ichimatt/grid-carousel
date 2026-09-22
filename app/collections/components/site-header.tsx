import Image from "next/image"
import Link from "next/link"
import { focusRing } from "./focus-ring"

const navLinks = [
  "Browse Short Courses",
  "Why GetSmarter®?",
  "About us",
  "Blog",
  "FAQ",
]

const navShadow =
  "shadow-[0_3px_3px_rgba(0,0,0,0.16),0_3px_3px_rgba(0,0,0,0.23)]"

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 5.5 5 5 5-5" />
    </svg>
  )
}

/**
 * The live GetSmarter header, as captured in the hi-fi Figma frames: a single
 * 56px bar until 1280px, then the grey utility bar over the 64px navy bar.
 * Sticky, so the page flows beneath it without a padding offset.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Single bar */}
      <div
        className={`flex h-14 items-stretch bg-ink text-[#eff2f5] xl:hidden ${navShadow}`}
      >
        <button
          type="button"
          className={`flex shrink-0 items-center gap-3 px-3.5 ${focusRing}`}
          aria-label="Expand menu"
        >
          <Image src="/collection/icn-ham.svg" alt="" width={28} height={22} />
          <span aria-hidden="true" className="hidden text-xs md:inline">
            MENU
          </span>
        </button>
        <div className="my-2 w-px bg-[#b1c0cf]" aria-hidden="true" />
        <Link
          href="/collections/enterprise-ai"
          className={`flex items-center px-[11px] ${focusRing}`}
          aria-label="GetSmarter home"
        >
          <Image
            src="/collections/logo-mobile.svg"
            alt=""
            width={62}
            height={32}
            // Explicit box: preflight's height:auto would otherwise resize
            // one axis and trip next/image's aspect-ratio warning.
            className="h-8 w-[62px]"
          />
        </Link>
        <div className="flex flex-1 items-center justify-end pr-3">
          <button
            type="button"
            className={`h-9 w-[118px] rounded-[28px] bg-[#e51470] text-sm/[21px] text-white capitalize ${focusRing}`}
          >
            Registrations
          </button>
        </div>
        <div className="my-2 w-px bg-[#b1c0cf]" aria-hidden="true" />
        <button
          type="button"
          className={`grid w-[50px] shrink-0 place-items-center ${focusRing}`}
          aria-label="Search"
        >
          <Image src="/collection/icn-search.svg" alt="" width={24} height={24} />
        </button>
      </div>

      {/* Utility bar + navigation bar */}
      <div className="hidden xl:block">
        <div className="flex h-10 items-stretch bg-[#eff2f5] text-xs text-ink">
          {/* A mode switch rather than the current page, hence aria-current="true". */}
          <a
            href="#"
            className={`grid w-40 place-items-center bg-ink text-[#eff2f5] ${focusRing}`}
            aria-current="true"
          >
            FOR YOU
          </a>
          <a href="#" className={`grid w-40 place-items-center ${focusRing}`}>
            FOR BUSINESS
          </a>
          <div className="flex flex-1 items-center justify-end gap-3.5 pr-5">
            <div className="flex items-center gap-2">
              <a href="#" className={`rounded-xs ${focusRing}`}>
                LOGOUT
              </a>
              <span className="text-sm text-[#212529]" aria-hidden="true">
                |
              </span>
              <a href="#" className={`rounded-xs ${focusRing}`}>
                MY PROFILE
              </a>
            </div>
            <label className="flex items-center">
              <span className="sr-only">Currency</span>
              <select
                className={`border border-[#767676] bg-white py-0.5 pr-4 pl-1 text-sm/[19px] text-black ${focusRing}`}
                defaultValue="ZAR"
              >
                <option>ZAR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </label>
          </div>
        </div>
        <div
          className={`flex h-16 items-stretch bg-ink text-base text-[#eff2f5] ${navShadow}`}
        >
          <Link
            href="/collections/enterprise-ai"
            className={`flex shrink-0 items-center pr-5 pl-[21px] ${focusRing}`}
            aria-label="GetSmarter home"
          >
            <Image
              src="/collections/logo-desktop.svg"
              alt=""
              width={159}
              height={36}
              className="h-9 w-[159px]"
            />
          </Link>
          {/* As on getsmarter.com: 10px link padding with the remaining space
              shared out around the links, so they close up rather than wrap
              as the bar narrows; below 1280px the single bar takes over. */}
          <nav
            aria-label="Primary"
            className="flex flex-1 items-stretch justify-around whitespace-nowrap"
          >
            <button
              type="button"
              className={`flex items-center gap-4 px-2.5 ${focusRing}`}
            >
              Explore
              <ChevronDown />
            </button>
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className={`flex items-center px-2.5 ${focusRing}`}
              >
                {link}
              </a>
            ))}
          </nav>
          {/* The search field gives up width first, down to 145px. */}
          <div className="flex basis-[252px] items-center gap-1 pl-[26px]">
            <Image
              src="/collection/icn-search.svg"
              alt=""
              width={16}
              height={16}
              className="shrink-0 opacity-80"
            />
            <input
              type="search"
              placeholder="Enter a search term..."
              aria-label="Search"
              className={`w-0 min-w-[145px] flex-1 rounded-xs bg-transparent py-1 text-sm font-light text-white italic placeholder:text-[#ccc] ${focusRing}`}
            />
          </div>
          <div className="flex shrink-0 items-center px-5">
            <button
              type="button"
              className={`h-[46px] w-[168px] rounded-[28px] bg-[#e51470] text-sm/[21px] text-white capitalize ${focusRing}`}
            >
              Register now
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
