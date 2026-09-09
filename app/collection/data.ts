/**
 * Content for the "Artificial Intelligence collection" page, lifted verbatim
 * from the Course-collections wireframes in Figma. One source of truth shared
 * by the desktop comparison table and all three mobile compare prototypes.
 */

export type CompareAttribute = {
  key: "chooseWhen" | "leaveWith" | "bestIf" | "price"
  /** Column header / tab / dropdown option label. */
  label: string
}

export const compareAttributes: CompareAttribute[] = [
  { key: "chooseWhen", label: "Choose when..." },
  { key: "leaveWith", label: "You’ll leave with..." },
  { key: "bestIf", label: "Best if you already..." },
  { key: "price", label: "Price and duration" },
]

export type Course = {
  slug: string
  /** Journey-stage band the course sits under in the comparison. */
  stage: string
  title: string
  provider: string
  image: string
  /** "6 weeks" – used on cards ("… starting 7 Oct 26") and in the table. */
  duration: string
  startDate: string
  price: string
  hoursPerWeek: string
  /** Card under the course card: bold question lead-in + regular remainder. */
  note: { lead: string; rest: string }
  compare: {
    chooseWhen: string
    leaveWith: string
    bestIf: string
  }
}

export const courses: Course[] = [
  {
    slug: "ai-implications-for-business-strategy",
    stage: "Build your foundation",
    title: "AI: Implications for Business Strategy",
    provider: "MIT Sloan and MIT CSAIL",
    image: "/collection/course-implications.jpg",
    duration: "6 weeks",
    startDate: "7 Oct 26",
    price: "$3,800",
    hoursPerWeek: "6–8 hours/week",
    note: {
      lead: "Still arguing about definitions?",
      rest: " Start with AI: Implications for Business Strategy. Get everyone speaking the same language and leave with your first roadmap.",
    },
    compare: {
      chooseWhen:
        "Conversations in your organisation still stall on what your AI strategy should be",
      leaveWith:
        "A tailored AI roadmap that you build specifically for your organisation",
      bestIf:
        "Have a view on where your business is heading, but not yet on where AI fits",
    },
  },
  {
    slug: "ai-adoption",
    stage: "Scale across the business",
    title: "AI Adoption",
    provider: "MIT Sloan",
    image: "/collection/course-adoption.jpg",
    duration: "6 weeks",
    startDate: "7 Oct 26",
    price: "$3,800",
    hoursPerWeek: "6–8 hours/week",
    note: {
      lead: "Got a strategy, but AI is happening in pockets with nothing to show for it?",
      rest: " Take AI Adoption. This is the one about deciding what to do now, next and later, and proving it worked.",
    },
    compare: {
      chooseWhen:
        "You have a strategy, but AI is happening in pockets with nothing to show for it",
      leaveWith:
        "An adoption playbook and a risk-based governance framework that you build specifically for your organisation",
      bestIf: "Know what you want AI to do for your business",
    },
  },
  {
    slug: "managing-ai-and-people",
    stage: "Run an AI-enabled team",
    title: "Managing AI and People",
    provider: "MIT Sloan",
    image: "/collection/course-managing.jpg",
    duration: "3 weeks",
    startDate: "7 Oct 26",
    price: "$1,900",
    hoursPerWeek: "6–8 hours/week",
    note: {
      lead: "Technology working, people not?",
      rest: " Take Managing AI and People. Who does what, who's accountable, and how teams actually work when some of the work isn't human.",
    },
    compare: {
      chooseWhen:
        "Your team is using AI and you need a way to lead them through what it changes",
      leaveWith:
        "The AI People Management Playbook, built around your own team and ready to run next week",
      bestIf: "Lead a team that's starting to use AI",
    },
  },
  {
    slug: "implementing-agentic-ai",
    stage: "Put agents to work",
    title: "Implementing Agentic AI",
    provider: "MIT Sloan",
    image: "/collection/course-agentic.jpg",
    duration: "3 weeks",
    startDate: "7 Oct 26",
    price: "$1,900",
    hoursPerWeek: "6–8 hours/week",
    note: {
      lead: "Past pilots and into real automation?",
      rest: " Take Implementing Agentic AI. How to run agents safely, where they genuinely add value, and how to explain the return.",
    },
    compare: {
      chooseWhen:
        "You're ready to work out how agents can move your business forward",
      leaveWith:
        "A pilot plan to roll out an agent across real workflows in your business, and the business case to go with it",
      bestIf: "Have spent time using AI in your role",
    },
  },
  {
    slug: "enterprise-ai-programme",
    stage: "Take the whole journey",
    title: "Enterprise AI Programme",
    provider: "MIT Sloan",
    image: "/collection/course-enterprise.jpg",
    duration: "3 weeks",
    startDate: "7 Oct 26",
    price: "$1,900",
    hoursPerWeek: "6–8 hours/week",
    note: {
      lead: "Own the whole thing?",
      rest: " The Enterprise AI Programme combines Implications, Adoption and Agentic AI into one journey, so you go from language to plan to execution without stopping to choose each time.",
    },
    compare: {
      chooseWhen: "You own the whole problem, not one stage of it",
      leaveWith:
        "A structured pathway from AI fluency to enterprise adoption, culminating in an artificial intelligence for business certificate. Widely recognised among the best ai certifications for business leaders, you leave with governed agent frameworks and board-ready artefacts.",
      bestIf:
        "Want to move from experimentation to impact without assembling the route yourself",
    },
  },
]

export const hero = {
  breadcrumb: { parent: "Home", current: "Artificial Intelligence collection" },
  title: "Turn AI into business results",
  intro:
    "Looking for an AI business class built for senior decision-makers? Everyone has run a pilot. Almost nobody has changed how the organisation actually works. These AI essentials for business courses from MIT cover strategy, adoption, agents, and the operating model holding it together. Each one enters the problem at a different point—the sections below will tell you where you come in.",
}

export const thinkDifferently = {
  title: "How you'll think about AI differently",
  items: [
    "You'll be able to look at an AI opportunity and tell what's real, what's hype, and what's worth your budget.",
    "You'll stop translating. The language you learn here is the language your board, your CTO and your CEO are already using.",
    "You'll know what to do when the technology works and the organisation doesn't, which is where most AI efforts actually fail.",
    'You\'ll be the person who moves the conversation from "what is it" to "what do we do about it."',
  ],
}

export const takeBackToWork = {
  title: "What you'll take back to work",
  items: [
    {
      lead: "An AI roadmap for your organisation.",
      rest: " Built during the programme, on your business, not a case study. Where to invest now, where to wait, where to hold back.",
    },
    {
      lead: "An AI adoption plan you can put in front of a budget holder.",
      rest: " What runs now, what runs next, what waits, and how each one gets measured.",
    },
    {
      lead: "An AI governance framework.",
      rest: " The guardrails, accountability and controls that let you scale AI without a nasty surprise.",
    },
    {
      lead: "A map of where agents actually add value in your business,",
      rest: " and what has to be true before you let them run.",
    },
    {
      lead: "A value case in board language.",
      rest: " Near-term returns, long-term returns, and how you'll know either one happened.",
    },
  ],
}

export const whoFor = {
  title: "Who these AI essentials for business courses are for?",
  paragraphs: [
    {
      rest: "You make decisions about AI. You don't build it. Whether you need an AI for executives online course or one of the best generative AI courses for executives, this portfolio is tailored for non-technical leadership.",
    },
    {
      pre: "You might ",
      lead: "run a business unit, lead a technology function, advise clients, or sit on an executive team.",
      rest: " You've got fifteen years behind you at least, and you're less worried about your next job title than about staying ahead of an industry that's changing faster than your last strategy cycle.",
    },
    {
      lead: "If you write code, look elsewhere.",
      rest: " If you decide what gets built, funded or stopped, start here.",
    },
  ],
}

export const compareSection = {
  title: "Compare AI for executive course programmes",
  intro: "Find the course that meets your executive use case.",
}

export const footerContent = {
  links: [
    "Contact us",
    "Join our team",
    "Press office",
    "Payment & financing",
    "Frequently asked questions",
    "Affiliates",
  ],
  address: ["358 Victoria Road, Salt River,", "Cape Town, 7925"],
  phones: [
    { region: "Global", number: "+27 21 100 6668" },
    { region: "US", number: "+1 617 977 6889" },
    { region: "UK", number: "+44 12 2379 0602" },
  ],
  socials: [
    { name: "Facebook", icon: "/collection/social-facebook.svg" },
    { name: "YouTube", icon: "/collection/social-youtube.svg" },
    { name: "X", icon: "/collection/social-x.svg" },
    { name: "Instagram", icon: "/collection/social-instagram.svg" },
    { name: "LinkedIn", icon: "/collection/social-linkedin.svg" },
  ],
  legal: [
    "Website terms of use",
    "Terms and conditions for students",
    "Privacy notice",
    "Your privacy choices",
    "Modern slavery statement",
    "PAIA manual",
    "Sitemap",
  ],
  copyright: "Copyright © 2026 GetSmarter",
}
