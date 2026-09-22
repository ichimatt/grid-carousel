/**
 * Copy for the version-ii Enterprise AI collection page, lifted from the
 * "hi-fi" section of the Course-collections Figma file (node 910-14635).
 * The collection and its five courses come from ../data; this file adds the
 * per-course springboard kickers and comparison values, and the page's
 * sections below the springboard.
 */

import type {
  Bullet,
  CollectionCourse,
  CompareAttribute,
  SpringboardCourse,
} from "../../types"
import { collection, courses as baseCourses } from "../data"

export { collection }
export type { CompareAttribute, SpringboardCourse } from "../../types"

export const compareAttributes: CompareAttribute[] = [
  { key: "challenge", label: "Business challenge" },
  { key: "outcomes", label: "Outcomes" },
  { key: "startingPoint", label: "Starting point" },
  { key: "price", label: "Price and duration" },
]

const extras: Record<string, Omit<SpringboardCourse, keyof CollectionCourse>> = {
  "ai-implications-for-business-strategy": {
    kicker: "Strategize",
    compare: {
      challenge:
        "Conversations in your organisation still stall on what your AI strategy should be",
      outcomes:
        "A tailored AI roadmap that you build specifically for your organisation",
      startingPoint:
        "Have a view on where your business is heading, but not yet on where AI fits",
      price: "$3,800",
      duration: "6 weeks (6-8 hours/week)",
    },
  },
  "ai-adoption": {
    kicker: "Adopt",
    compare: {
      challenge:
        "You have a strategy, but AI is happening in pockets with nothing to show for it",
      outcomes:
        "An adoption playbook and a risk-based governance framework that you build specifically for your organisation",
      startingPoint: "Know what you want AI to do for your business",
      price: "$3,800",
      duration: "6 weeks (6-8 hours/week)",
    },
  },
  "managing-ai-and-people": {
    kicker: "Manage",
    compare: {
      challenge:
        "Your team is using AI and you need a way to lead them through what it changes",
      outcomes:
        "The AI People Management Playbook, built around your own team and ready to run next week",
      startingPoint: "Lead a team that's starting to use AI",
      price: "$1,900",
      duration: "3 weeks (6-8 hours/week)",
    },
  },
  "implementing-agentic-ai": {
    kicker: "Automate",
    compare: {
      challenge:
        "You're ready to work out how agents can move your business forward",
      outcomes:
        "A pilot plan to roll out an agent across real workflows in your business, and the business case to go with it",
      // The Figma frame repeats the previous course's starting point here;
      // this is the wireframe's value for the course.
      startingPoint: "Have spent time using AI in your role",
      price: "$1,900",
      duration: "3 weeks (6-8 hours/week)",
    },
  },
  "enterprise-ai-programme": {
    kicker: "3 course stack",
    compare: {
      challenge: "You own the whole problem, not one stage of it",
      outcomes:
        "A structured pathway from AI fluency to enterprise adoption, culminating in an artificial intelligence for business certificate.",
      startingPoint:
        "Want to move from experimentation to impact without assembling the route yourself",
      price: "$8,250",
      duration: "4 months (6-8 hours/week)",
    },
  },
}

export const courses: SpringboardCourse[] = baseCourses.map((course) => {
  const extra = extras[course.slug]
  if (!extra) throw new Error(`No version-ii copy for ${course.slug}`)
  return {
    ...course,
    ...extra,
    // The design sets the hyphen non-breaking so the headline never wraps
    // after "AI-".
    stage: course.stage.replace("AI-enabled", "AI‑enabled"),
  }
})

export const thinkDifferently = {
  title: "How you'll think about AI differently",
  items: [
    "You'll be able to look at an AI opportunity and tell what's real, what's hype, and what's worth your budget.",
    "You'll stop translating. The language you learn here is the language your board, your CTO and your CEO are already using.",
    "You'll know what to do when the technology works and the organisation doesn't, which is where most AI efforts actually fail.",
    "You'll be the person who moves the conversation from “what is it” to “what do we do about it.”",
  ],
}

export const takeBackToWork: { title: string; items: Bullet[] } = {
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
      lead: "A map of where agents actually add value in your business",
      rest: ", and what has to be true before you let them run.",
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
    "You make decisions about AI. You don't build it. Whether you need an AI for executives online course or one of the best generative AI courses for executives, this portfolio is tailored for non-technical leadership.",
    "You might run a business unit, lead a technology function, advise clients, or sit on an executive team. You've got fifteen years behind you at least, and you're less worried about your next job title than about staying ahead of an industry that's changing faster than your last strategy cycle.",
    "If you write code, look elsewhere. If you decide what gets built, funded or stopped, start here.",
  ],
}

export const compareSection = {
  title: "Compare AI for executive course programmes",
  intro: "Find the course that meets your executive use case.",
}

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
        "The best ai courses for business leaders prioritize organizational change and governance over technical coding. Evaluating the best ai for business course comes down to whether it moves your ai strategy for business leaders from hype to impact by delivering tailored roadmaps, business cases, and scalable operating models.",
    },
    {
      question: "What is the 10/20-70 rule for AI?",
      answer:
        "The 10/20/-70 rule indicates that successful AI transformation relies 10% on algorithms, 20% on technology infrastructure, and 70% on business process redesign, cultural adoption, and people leadership. Most enterprise efforts stall because leadership focuses entirely on technical tooling while ignoring the organizational change required to realize value.",
    },
    {
      question: "What businesses will benefit most from AI?",
      answer:
        "Organizations with complex workflows, extensive data assets, and high coordination costs stand to gain the most. However, long-term advantage will not belong to the companies running the most pilots, but to those that successfully adapt their operating models to integrate human-AI teams and autonomous agents safely at scale.",
    },
  ],
}

export const whyDifferent = {
  // The desktop frame reads "Why these aren't like other online courses"; the
  // mobile frame carries the fuller, later copy used here.
  title: "Why these aren't like other online AI business courses?",
  items: [
    "Learn from, and alongside a global network of senior working professionals, subject matter experts, and world-class faculty.",
    "Designed to challenge you, but built around your working life, one module a week, moving with your cohort, on your own time.",
    "Leave with more than knowledge - build practical strategies, roadmaps, and plans for your own context, ready to put to work in your career or business.",
    "Earn a credential from MIT Sloan that signals what you can actually do, earned through assignments graded by subject matter experts, from a world-leading university.",
    "Enterprise-ready: Develop your team together, in the same cohort, on the same timeline, building shared language, shared frameworks, and outcomes that compound across the organisation.",
  ],
}
