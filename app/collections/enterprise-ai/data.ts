/**
 * Copy for the hi-fi Enterprise AI collection page, lifted from the
 * "high-fidelity" section of the Course-collections Figma file. Kicker,
 * course count, title and theme come from the shared collections list so the
 * page and the collection carousel stay in step.
 */

import { collections } from "@/app/components/collection-carousel/collections"
import type { CollectionCourse } from "../types"

const enterpriseAi = collections.find((c) => c.slug === "enterprise-ai")
if (!enterpriseAi) throw new Error("Enterprise AI collection missing")

export const collection = {
  ...enterpriseAi,
  breadcrumb: { parent: "Home", current: "Enterprise AI collection" },
  intro:
    "Looking for an AI business class built for senior decision-makers? Everyone has run a pilot. Almost nobody has changed how the organisation actually works. These AI essentials for business courses from MIT cover strategy, adoption, agents, and the operating model holding it together. Each one enters the problem at a different point—the sections below will tell you where you come in.",
}

export type { CollectionCourse } from "../types"

export const courses: CollectionCourse[] = [
  {
    slug: "ai-implications-for-business-strategy",
    title: "AI: Implications for Business Strategy",
    provider: "MIT Sloan and MIT CSAIL",
    image: "/collection/course-implications.jpg",
    type: "Short course",
    duration: "6 weeks",
    startDate: "1 Oct",
    stage: "Build your foundation",
    note: {
      lead: "Still arguing about definitions?",
      rest: "Get everyone speaking the same language and leave with your first roadmap.",
    },
    href: "#",
  },
  {
    slug: "ai-adoption",
    title: "AI Adoption: Driving Business Value and Impact",
    provider: "MIT Sloan School of Management",
    image: "/collection/course-adoption.jpg",
    type: "Short course",
    duration: "6 weeks",
    startDate: "7 Oct",
    stage: "Scale across the business",
    note: {
      lead: "Got a strategy, but AI is happening in pockets with nothing to show for it?",
      rest: "This is the one about deciding what to do now, next and later, and proving it worked.",
    },
    href: "#",
  },
  {
    slug: "managing-ai-and-people",
    title: "Managing AI and People",
    provider: "MIT Sloan",
    image: "/collection/course-managing.jpg",
    type: "Short course",
    duration: "6 weeks",
    startDate: "1 Oct",
    stage: "Run an AI-enabled team",
    note: {
      lead: "Technology working, people not?",
      rest: "Establish who does what, who's accountable, and how teams actually work when some of the work isn't human.",
    },
    href: "#",
  },
  {
    slug: "implementing-agentic-ai",
    title: "Implementing Agentic AI: Building Your Organizational Playbook",
    provider: "MIT Sloan and MIT Schwarzman College",
    image: "/collection/course-agentic.jpg",
    type: "Micro course",
    duration: "3 weeks",
    startDate: "1 Oct",
    stage: "Put agents to work",
    note: {
      lead: "Past pilots and into real automation?",
      rest: "Learn how to run agents safely, where they genuinely add value, and how to explain the return.",
    },
    href: "#",
  },
  {
    slug: "enterprise-ai-programme",
    title: "Enterprise AI Programme",
    provider: "MIT Sloan School of Management",
    image: "/collection/course-enterprise.jpg",
    type: "Course stack",
    duration: "18 weeks",
    startDate: "1 Oct",
    stage: "Take the whole journey",
    note: {
      lead: "Own the whole thing?",
      rest: "This combines Implications, Adoption and Agentic AI into one journey, so you go from language to plan to execution without stopping to choose each time.",
    },
    href: "#",
  },
]
