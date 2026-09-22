import Image from "next/image"
import { focusRing } from "./focus-ring"

const siteLinks = [
  "Contact us",
  "Join our team",
  "Press office",
  "Payment & financing",
  "Frequently asked questions",
  "Affiliates",
]

const phones = [
  { region: "Global", number: "+27 21 100 6668" },
  { region: "US", number: "+1 617 977 6889" },
  { region: "UK", number: "+44 12 2379 0602" },
]

const socials = [
  { name: "Facebook", icon: "social-facebook.svg" },
  { name: "YouTube", icon: "social-youtube.svg" },
  { name: "X", icon: "social-x.svg" },
  { name: "Instagram", icon: "social-instagram.svg" },
  { name: "LinkedIn", icon: "social-linkedin.svg" },
]

const legalLinks = [
  "Website terms of use",
  "Terms and conditions for students",
  "Privacy notice",
  "Your privacy choices",
  "Modern slavery statement",
  "PAIA manual",
  "Sitemap",
]

const currencies = ["ZAR", "USD", "GBP"]

const textLink = `rounded-xs transition-colors hover:text-white ${focusRing}`
// Stacked links keep their designed line pitch but get a 24px hit area.
const stackedLink = `inline-block -my-1 py-1 ${textLink}`

/**
 * The GetSmarter site footer (Figma 910:14503 desktop, 910:12695 mobile).
 * The two layouts order the same pieces differently, so each is written in
 * its own visual order from shared parts and the other is display:none:
 * that keeps keyboard and reading order true to what is on screen.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-ink text-[#b1c0cf]">
      {/* Mobile: logo, links, contact details, then socials and legals. */}
      <div className="pt-[35px] pb-[22px] lg:hidden">
        <Logo className="mx-auto" />
        <div className="mt-[25px] pl-[15px] text-xs/[18px]">
          <SiteLinks />
          <EdxLogo className="mt-2.5" />
          <Address className="mt-3" />
        </div>
        <div className="flex h-[85px] items-start px-[17px]">
          <Phones className="px-5 pt-5" />
          <Currency
            className="ml-auto pt-[15px] pr-[35px]"
            selectClassName="h-6 w-[55px] text-base/[22px]"
          />
        </div>
        <Socials className="mt-[15px] justify-center" />
        <Legals className="mx-[25px] mt-4" ruleClassName="mx-[15px]" />
      </div>

      {/* Desktop: links | centred branding | currency | contact, then legals. */}
      <div className="hidden px-[75px] pt-[35px] pb-[31px] lg:block">
        <div className="flex h-[184px] items-start justify-between">
          <div className="w-[180px] text-sm/[21px]">
            <SiteLinks />
            <EdxLogo className="mt-2.5" />
          </div>
          {/* The 22px inset drops the logo below the first link's cap height. */}
          <div className="flex flex-1 flex-col items-center pt-[22px]">
            <Logo />
            <Socials className="mt-[22px]" />
          </div>
          <Currency
            className="pr-5"
            selectClassName="h-[19px] w-[47px] text-xs/[17px]"
          />
          <div className="flex w-[159px] flex-col gap-2.5 text-xs/[18px]">
            <Address />
            <Phones className="gap-x-[22px]" numberClassName="leading-[18px]" />
          </div>
        </div>
        <Legals />
      </div>
    </footer>
  )
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/collections/logo-footer.svg"
      alt="GetSmarter with edX"
      width={176}
      height={70}
      // Preflight's `height: auto` would shrink the 176x70 box to the SVG's
      // own ratio; the classes keep the designed box.
      className={`h-[70px] w-[176px] ${className}`}
    />
  )
}

function EdxLogo({ className = "" }: { className?: string }) {
  return (
    <a href="#" className={`block w-fit ${focusRing} ${className}`}>
      <Image
        src="/collections/logo-edx.svg"
        alt="edX Online"
        width={105}
        height={55}
        className="h-[55px] w-[105px]"
      />
    </a>
  )
}

function SiteLinks() {
  return (
    <nav aria-label="Site">
      {/* nowrap: the longest link is a hair wider than the desktop column. */}
      <ul role="list" className="whitespace-nowrap">
        {siteLinks.map((label) => (
          <li key={label}>
            <a href="#" className={stackedLink}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Address({ className = "" }: { className?: string }) {
  return (
    <address className={`text-xs/[18px] not-italic ${className}`}>
      358 Victoria Road, Salt River,
      <br />
      Cape Town, 7925
    </address>
  )
}

function Phones({
  className = "",
  numberClassName = "",
}: {
  className?: string
  numberClassName?: string
}) {
  return (
    // Baseline alignment lets the bold labels set the row height while the
    // numbers sit on the same line.
    <dl
      className={`grid grid-cols-[auto_1fr] items-baseline gap-x-5 text-xs/[21.6px] ${className}`}
    >
      {phones.map(({ region, number }) => (
        // A fragment keeps dt/dd as direct grid items of the list.
        <PhoneRow
          key={region}
          region={region}
          number={number}
          className={numberClassName}
        />
      ))}
    </dl>
  )
}

function PhoneRow({
  region,
  number,
  className,
}: {
  region: string
  number: string
  className: string
}) {
  return (
    <>
      <dt className="font-bold">{region}</dt>
      <dd className={className}>
        <a href={`tel:${number.replace(/\s/g, "")}`} className={stackedLink}>
          {number}
        </a>
      </dd>
    </>
  )
}

function Currency({
  className = "",
  selectClassName,
}: {
  className?: string
  selectClassName: string
}) {
  return (
    // The native select with its chrome stripped, as designed.
    <label className={`block ${className}`}>
      <span className="sr-only">Currency</span>
      <select
        defaultValue="ZAR"
        className={`block cursor-pointer appearance-none rounded-xs border-0 bg-ink pl-1 text-white ${selectClassName} ${focusRing}`}
      >
        {currencies.map((code) => (
          <option key={code}>{code}</option>
        ))}
      </select>
    </label>
  )
}

function Socials({ className = "" }: { className?: string }) {
  return (
    <ul role="list" className={`flex ${className}`}>
      {socials.map(({ name, icon }) => (
        <li key={name}>
          {/* 3px padding gives each 24px icon a 30px hit area. */}
          <a href="#" className={`block rounded-full p-[3px] ${focusRing}`}>
            <Image
              src={`/collections/${icon}`}
              alt={`GetSmarter on ${name}`}
              width={24}
              height={24}
            />
          </a>
        </li>
      ))}
    </ul>
  )
}

function Legals({
  className = "",
  ruleClassName = "",
}: {
  className?: string
  ruleClassName?: string
}) {
  return (
    <div className={className}>
      <hr className={`border-0 border-t border-black/10 ${ruleClassName}`} />
      <nav aria-label="Legal" className="pt-[25px] text-center text-xs/[18px]">
        <ul role="list">
          {legalLinks.map((label, index) => (
            <li key={label} className="inline">
              {index > 0 && <span aria-hidden="true"> | </span>}
              <a href="#" className={textLink}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="text-center text-xs/[18px]">Copyright © 2026 GetSmarter</p>
    </div>
  )
}
