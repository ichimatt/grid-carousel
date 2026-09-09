/**
 * Content specific to the "version ii" redesign of the Collection page,
 * lifted from the Course-collections wireframes in Figma. Course facts stay
 * in ../data — this file only holds v2's re-cut copy and net-new sections.
 */

import {
  takeBackToWork,
  thinkDifferently,
  whoFor,
  type CompareAttribute,
} from "../data"

export const hero = {
  breadcrumb: { parent: "Home", current: "MIT AI collection" },
  title: "Turn AI into business results",
  intro:
    "Looking for an AI business class built for senior decision-makers? Everyone has run a pilot. Almost nobody has changed how the organisation actually works. These AI essentials for business courses from MIT cover strategy, adoption, agents, and the operating model holding it together. Each one enters the problem at a different point.",
}

/**
 * Card-side notes re-cut for v2: the card sits right next to the note, so the
 * "Take X." sentence naming the course goes. Keyed by course slug; fall back
 * to the course's own note for any slug not re-cut.
 */
export const courseNotes: Record<string, { lead: string; rest: string }> = {
  "ai-implications-for-business-strategy": {
    lead: "Still arguing about definitions?",
    rest: " Get everyone speaking the same language and leave with your first roadmap.",
  },
  "ai-adoption": {
    lead: "Got a strategy, but AI is happening in pockets with nothing to show for it?",
    rest: " This is the one about deciding what to do now, next and later, and proving it worked.",
  },
  "managing-ai-and-people": {
    lead: "Technology working, people not?",
    rest: " Who does what, who's accountable, and how teams actually work when some of the work isn't human.",
  },
  "implementing-agentic-ai": {
    lead: "Past pilots and into real automation?",
    rest: " How to run agents safely, where they genuinely add value, and how to explain the return.",
  },
  "enterprise-ai-programme": {
    lead: "Own the whole thing?",
    rest: " The Enterprise AI Programme combines Implications, Adoption and Agentic AI into one journey, so you go from language to plan to execution without stopping to choose each time.",
  },
}

export type InsightParagraph = (typeof whoFor.paragraphs)[number]

export type InsightSection = {
  /** Short label shown in the desktop tab rail. */
  rail: string
  /** Full heading shown above the section content. */
  title: string
} & (
  | { kind: "numbered"; items: { lead?: string; rest: string }[] }
  | { kind: "prose"; paragraphs: InsightParagraph[] }
)

/**
 * The four "more about these courses" sections: a tabbed rail on desktop,
 * stacked sections (numbered ones as carousels) on mobile.
 */
export const insightSections: InsightSection[] = [
  {
    kind: "numbered",
    rail: "How you’ll think differently",
    title: thinkDifferently.title,
    items: thinkDifferently.items.map((rest) => ({ rest })),
  },
  {
    kind: "numbered",
    rail: "What you’ll take back to work",
    title: takeBackToWork.title,
    items: takeBackToWork.items,
  },
  {
    kind: "prose",
    rail: "When it’s right for you",
    title: whoFor.title,
    paragraphs: whoFor.paragraphs,
  },
  {
    kind: "numbered",
    rail: "How these courses are different",
    title: "Why these aren’t like other online AI business courses?",
    items: [
      {
        rest: "Learn from, and alongside, a global network of senior working professionals, subject matter experts, and world-class faculty.",
      },
      {
        rest: "Designed to challenge you, but built around your working life — one module a week, moving with your cohort, on your own time.",
      },
      {
        rest: "Leave with more than knowledge — build practical strategies, roadmaps, and plans for your own context, ready to put to work in your career or business.",
      },
      {
        rest: "Earn a credential from MIT Sloan that signals what you can actually do, earned through assignments graded by subject matter experts, from a world-leading university.",
      },
      {
        rest: "Enterprise-ready: develop your team together, in the same cohort, on the same timeline, building shared language, shared frameworks, and outcomes that compound across the organisation.",
      },
    ],
  },
]

/** v2 relabels the compare attributes; the keys still index Course["compare"]. */
export const compareAttributes: CompareAttribute[] = [
  { key: "chooseWhen", label: "Challenge" },
  { key: "leaveWith", label: "Outcomes" },
  { key: "bestIf", label: "Prerequisites" },
  { key: "price", label: "Price and duration" },
]

/**
 * On mobile every compare card carries price and duration in its own header
 * row, so the tabs only cover the three narrative attributes.
 */
export const mobileCompareAttributes = compareAttributes.filter(
  (attribute) => attribute.key !== "price"
)

export const faq = {
  title: "Frequently asked questions",
  items: [
    {
      question: "How can executives use AI?",
      answer:
        "Executives use AI to retool core operating models, unlock capacity, and drive strategic advantage rather than writing code or running isolated pilots. The primary executive responsibility is aligning AI investments with measurable business metrics, establishing governance guardrails, and leading teams through operational change.",
    },
    {
      question: "How can I integrate AI into my business?",
      answer:
        "Successful integration requires addressing strategy, technology, and workforce adoption simultaneously. Start by isolating high-value workflows, building a risk-based governance framework, and creating a phased adoption plan that proves financial returns before scaling enterprise-wide.",
    },
    {
      question: "What are the best AI courses for leaders?",
      answer:
        "The best AI courses for business leaders prioritise organisational change and governance over technical coding. Evaluating the best AI for business course comes down to whether it moves your AI strategy for business leaders from hype to impact by delivering tailored roadmaps, business cases, and scalable operating models.",
    },
    {
      question: "What is the 10/20/70 rule for AI?",
      answer:
        "The 10/20/70 rule indicates that successful AI transformation relies 10% on algorithms, 20% on technology infrastructure, and 70% on business process redesign, cultural adoption, and people leadership. Most enterprise efforts stall because leadership focuses entirely on technical tooling while ignoring the organisational change required to realise value.",
    },
    {
      question: "What businesses will benefit most from AI?",
      answer:
        "Organisations with complex workflows, extensive data assets, and high coordination costs stand to gain the most. However, long-term advantage will not belong to the companies running the most pilots, but to those that successfully adapt their operating models to integrate human-AI teams and autonomous agents safely at scale.",
    },
  ],
}
