import Image from "next/image"
import Link from "next/link"

const navLinks = [
  "Browse Short Courses",
  "Why GetSmarter®?",
  "About us",
  "Blog",
  "FAQ",
]

const navShadow =
  "shadow-[0_3px_3px_rgba(0,0,0,0.16),0_3px_3px_rgba(0,0,0,0.23)]"

function ChevronDown({ className }: { className?: string }) {
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
      className={className}
    >
      <path d="m3 5.5 5 5 5-5" />
    </svg>
  )
}

/** Fixed page header: single 56px bar on mobile, utility bar + 64px main bar on desktop. */
export default function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Mobile bar */}
      <div className={`flex h-14 items-stretch bg-wf text-white lg:hidden ${navShadow}`}>
        <button
          type="button"
          className="grid w-14 shrink-0 place-items-center"
          aria-label="Expand menu"
        >
          <Image src="/collection/icn-ham.svg" alt="" width={28} height={22} />
        </button>
        <div className="my-2 w-px bg-wf-mist" aria-hidden="true" />
        <Link href="/collection" className="flex items-center px-3" aria-label="GetSmarter home">
          <Image src="/collection/logo-mobile.svg" alt="" width={61} height={32} />
        </Link>
        <div className="flex flex-1 items-center justify-end pr-3">
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-sm capitalize"
          >
            Register now
          </button>
        </div>
        <div className="my-2 w-px bg-wf-mist" aria-hidden="true" />
        <button
          type="button"
          className="grid w-[50px] shrink-0 place-items-center"
          aria-label="Search"
        >
          <Image src="/collection/icn-search.svg" alt="" width={23} height={23} />
        </button>
      </div>

      {/* Desktop bars */}
      <div className="hidden lg:block">
        <div className="flex h-10 items-stretch bg-wf-sky text-xs">
          <a
            href="#"
            className="grid w-40 place-items-center bg-wf text-wf-sky"
            aria-current="page"
          >
            FOR YOU
          </a>
          <a href="#" className="grid w-40 place-items-center text-wf">
            FOR BUSINESS
          </a>
          <div className="flex flex-1 items-center justify-end gap-4 pr-5">
            <div className="flex items-center gap-2">
              <a href="#" className="text-wf">
                LOGIN
              </a>
              <span className="text-sm text-[#212529]" aria-hidden="true">
                |
              </span>
              <a href="#" className="text-wf">
                SIGN UP
              </a>
            </div>
            <label className="flex items-center">
              <span className="sr-only">Currency</span>
              <select
                className="border border-[#767676] bg-white py-0.5 pl-1 pr-4 text-sm text-wf"
                defaultValue="ZAR"
              >
                <option>ZAR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </label>
          </div>
        </div>
        <div className={`flex h-16 items-stretch bg-wf text-wf-sky ${navShadow}`}>
          <Link
            href="/collection"
            className="flex items-center pl-2.5 pr-5"
            aria-label="GetSmarter home"
          >
            <Image src="/collection/logo-desktop.svg" alt="" width={159} height={36} />
          </Link>
          <nav aria-label="Primary" className="flex flex-1 items-stretch justify-center">
            <button
              type="button"
              className="flex items-center gap-3 px-6"
            >
              Explore
              <ChevronDown />
            </button>
            {navLinks.map((link) => (
              <a key={link} href="#" className="flex items-center px-6">
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-6 pr-5">
            <div className="flex items-center gap-2">
              <Image
                src="/collection/icn-search.svg"
                alt=""
                width={16}
                height={16}
                className="opacity-80"
              />
              <input
                type="search"
                placeholder="Enter a search term..."
                aria-label="Search"
                className="w-44 bg-transparent py-1 text-sm font-light italic text-white placeholder:text-[#ccc] focus:outline-none focus-visible:border-b focus-visible:border-white/60"
              />
            </div>
            <button
              type="button"
              className="rounded-full bg-white px-10 py-3 text-sm capitalize text-wf"
            >
              Register now
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
