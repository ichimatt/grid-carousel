/** Shared shapes for the hi-fi collection pages and their components. */

export type CollectionCourse = {
  slug: string
  title: string
  provider: string
  image: string
  startDate: string
  /** Journey-stage headline: "Build your foundation". */
  stage: string
  /** Bold question lead-in, then the regular remainder. */
  note: { lead: string; rest: string }
  href: string
}

export type CompareAttributeKey =
  | "challenge"
  | "outcomes"
  | "startingPoint"
  | "price"

export type CompareAttribute = {
  key: CompareAttributeKey
  /** Tab label on desktop; card label on mobile. */
  label: string
}

/** A course as shown in the version-ii springboard and comparison table. */
export type SpringboardCourse = CollectionCourse & {
  /** Themed one-word kicker above the stage headline: "Strategize". */
  kicker: string
  compare: {
    challenge: string
    outcomes: string
    startingPoint: string
    /** Shown bold on its own line: "$3,800". */
    price: string
    /** Under the price: "6 weeks (6-8 hours/week)". */
    duration: string
  }
}

/** A checked point: an optional bold lead-in, then the rest of the sentence. */
export type Bullet = { lead?: string; rest: string }
