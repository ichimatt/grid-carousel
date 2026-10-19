/**
 * Content of the desktop mega nav (Figma "mega-nav-desktop", node 1902-29345):
 * three columns of links carried over from getsmarter.com, each titled by a
 * link to the full listing and closed by a "View all" link to the same, and
 * the new Playbooks column.
 */
export type MegaNavLink = { label: string; href: string }

export type MegaNavLinkColumn = {
  /** Column title; it links to the full listing. */
  title: string
  href: string
  items: MegaNavLink[]
  /** The "View all" link at the foot of the column. */
  footer: MegaNavLink
}

/** The three colours a playbook item takes from its theme in the Figma theme collection. */
export type PlaybookTheme = {
  /** theme-color (ramp 600): the bar beside the item. */
  color: string
  /** theme-bg (ramp 50): the item's hover fill. */
  bg: string
  /** theme-text (ramp 800): the subtitle on hover. */
  text: string
}

export type MegaNavPlaybook = {
  title: string
  subtitle: string
  href: string
  theme: PlaybookTheme
}

const links = (labels: string[]): MegaNavLink[] =>
  labels.map((label) => ({ label, href: "#" }))

export const linkColumns: MegaNavLinkColumn[] = [
  {
    title: "Top courses",
    href: "#",
    items: links([
      "MIT Sloan AI Adoption",
      "MIT Sloan AI: Implications for Business Strategy",
      "Oxford Artificial Intelligence Programme",
      "LSE MBA Essentials",
      "Cambridge Business Sustainability Management",
      "Oxford Executive Leadership Programme",
      "MIT Sloan AI in Pharma and Biotech",
      "LSE Real Estate Economics and Finance",
      "Yale SOM Women’s Leadership Program",
      "Cambridge Sustainable Finance",
      "UCT Digital Marketing",
      "UCT Data Science Analysis",
    ]),
    footer: { label: "View all courses", href: "#" },
  },
  {
    title: "Universities",
    href: "#",
    items: links([
      "Massachusetts Institute of Technology",
      "Yale University",
      "LSE",
      "University of Cambridge",
      "University of Cape Town",
      "Harvard University",
      "University of Oxford",
      "Stanford University",
      "University of Toronto",
      "University of California, Davis",
      "Rice University",
      "University of Cape Town Graduate School of Business",
    ]),
    footer: { label: "View all universities", href: "#" },
  },
  {
    title: "Categories",
    href: "#",
    items: links([
      "Artificial Intelligence",
      "Business Management and Strategy",
      "Project Management",
      "Leadership and Interpersonal Skills",
      "Health Sciences and Wellness",
      "Marketing",
      "Finance and Investment",
      "Data Science and Analysis",
      "Sustainability",
      "Real Estate",
      "Law and Compliance",
      "Operations and Supply Chain Management",
    ]),
    footer: { label: "View all categories", href: "#" },
  },
]

export const playbooksTitle = "Playbooks"

/**
 * The six playbooks in the frame's order, each in its own theme (the mode
 * set on its row in Figma, the ramp its collection tile also wears): ramp
 * 600, 50 and 800. Subtitles use typographic apostrophes.
 */
export const playbooks: MegaNavPlaybook[] = [
  {
    title: "AI for Executives",
    subtitle: "Turn AI into business results",
    href: "#",
    theme: { color: "#9a4144", bg: "#fef2f0", text: "#720119" }, // crimson (theme-7, MIT)
  },
  {
    title: "General Management",
    subtitle: "Lead beyond your function",
    href: "#",
    theme: { color: "#0b6b47", bg: "#f1f7f0", text: "#024630" }, // sage
  },
  {
    title: "Executive Leadership",
    subtitle: "Step up to senior leadership",
    href: "#",
    theme: { color: "#815503", bg: "#f8f5eb", text: "#543201" }, // gold
  },
  {
    title: "Responsible AI",
    subtitle: "Implement AI responsibly",
    href: "#",
    theme: { color: "#046971", bg: "#edf8f6", text: "#02434b" }, // teal
  },
  {
    title: "Practical Healthcare",
    subtitle: "Cover medical school’s gaps",
    href: "#",
    theme: { color: "#4c58a2", bg: "#f0f6fe", text: "#302a80" }, // indigo
  },
  {
    title: "Public Policy",
    subtitle: "Move policy forward",
    href: "#",
    theme: { color: "#99442e", bg: "#fdf3ed", text: "#710801" }, // vermillion
  },
]
