import Image from "next/image"
import { footerContent } from "../data"

function Socials() {
  return (
    <ul className="flex items-center justify-center">
      {footerContent.socials.map((social) => (
        <li key={social.name} className="px-[3px]">
          <a href="#" aria-label={social.name} className="block p-1">
            <Image src={social.icon} alt="" width={24} height={24} />
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function SiteFooter() {
  return (
    <footer className="bg-wf text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-9 pb-8 lg:grid lg:grid-cols-[12rem_1fr_11rem] lg:items-start lg:px-10">
        {/* GetSmarter logo — first on mobile, centre column on desktop */}
        <div className="order-1 flex flex-col items-center gap-6 lg:order-2">
          <a href="#" aria-label="GetSmarter">
            <Image src="/collection/logo-footer.svg" alt="" width={176} height={70} />
          </a>
          <div className="hidden lg:block">
            <Socials />
          </div>
        </div>

        {/* Links + edX */}
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <ul className="flex flex-col gap-1.5 text-xs lg:gap-2 lg:text-sm">
            {footerContent.links.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a href="#" aria-label="edX">
            <Image src="/collection/logo-edx.svg" alt="" width={105} height={55} />
          </a>
        </div>

        {/* Address, phones, currency */}
        <div className="order-3 flex flex-col gap-4 text-xs">
          <p>
            {footerContent.address[0]}
            <br />
            {footerContent.address[1]}
          </p>
          <div className="flex items-start justify-between gap-6 lg:flex-col lg:gap-2">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {footerContent.phones.map((phone) => (
                <div key={phone.region} className="col-span-2 grid grid-cols-subgrid">
                  <dt className="font-bold">{phone.region}</dt>
                  <dd>
                    <a href={`tel:${phone.number.replace(/\s/g, "")}`}>{phone.number}</a>
                  </dd>
                </div>
              ))}
            </dl>
            <label className="flex items-center lg:hidden">
              <span className="sr-only">Currency</span>
              <select
                className="bg-wf py-0.5 pl-1 pr-2 text-base text-white"
                defaultValue="ZAR"
              >
                <option>ZAR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </label>
          </div>
        </div>

        <div className="order-4 lg:hidden">
          <Socials />
        </div>
      </div>

      {/* Legal bar */}
      <div className="mx-4 border-t border-white/10 px-4 py-5 text-center text-xs lg:mx-0">
        <p className="mx-auto max-w-xl lg:max-w-none">
          {footerContent.legal.map((item, index) => (
            <span key={item}>
              {index > 0 && <span aria-hidden="true"> | </span>}
              <a href="#" className="hover:text-white">
                {item}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-2">{footerContent.copyright}</p>
      </div>
    </footer>
  )
}
