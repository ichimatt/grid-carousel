/**
 * The six "constrained graphic" symbols from the Figma library as plain SVG
 * primitives, so the React tile and the Optimizely snippet draw the same
 * geometry. Coordinates are the library's own: an 80x80 artboard with the
 * 72px disc at (4, 2); the viewBox frames just the disc, which clips every
 * symbol. Fills are three steps of the collection's ramp.
 */
export type ConstrainedGraphicName = "eye" | "ring" | "play" | "blocks" | "plus" | "books"

export type GraphicPrimitive =
  | { tag: "rect"; x: number; y: number; width: number; height: number; rx?: number; fill: string; transform?: string }
  | { tag: "circle"; cx: number; cy: number; r: number; fill: string }
  | { tag: "path"; d: string; fill: string }

export const GRAPHIC_VIEW_BOX = "4 2 72 72"
/** The disc every symbol sits on, and the clip for whatever reaches past it. */
export const DISC = { x: 4, y: 2, width: 72, height: 72, rx: 36 } as const

const LIGHT = "var(--theme-symbol-light)"
const BASE = "var(--theme-symbol)"
const DARK = "var(--theme-symbol-dark)"

const disc = (fill: string): GraphicPrimitive => ({ tag: "rect", ...DISC, fill })

export const constrainedGraphics: Record<ConstrainedGraphicName, GraphicPrimitive[]> = {
  // AI for Executives: two dark lobes on the left and an eye on the right.
  eye: [
    disc(BASE),
    { tag: "path", d: "M-28 70C-28 52.3269 -13.6731 38 4 38C21.6731 38 36 52.3269 36 70C36 87.6731 21.6731 102 4 102C-13.6731 102 -28 87.6731 -28 70Z", fill: DARK },
    { tag: "path", d: "M-28 6C-28 -11.6731 -13.6731 -26 4 -26C21.6731 -26 36 -11.6731 36 6C36 23.6731 21.6731 38 4 38C-13.6731 38 -28 23.6731 -28 6Z", fill: DARK },
    { tag: "circle", cx: 52, cy: 38, r: 10, fill: LIGHT },
    { tag: "circle", cx: 42, cy: 38, r: 10, fill: DARK },
    { tag: "path", d: "M52 38C52 41.7007 49.9881 44.9289 47 46.6582C44.0119 44.9289 42 41.7007 42 38C42 34.2991 44.0117 31.0701 47 29.3408C49.9883 31.0701 52 34.2991 52 38Z", fill: BASE },
  ],
  // Responsible AI: a dark half ring around a light half disc.
  ring: [
    disc(BASE),
    { tag: "path", d: "M40 26C33.3726 26 28 31.3726 28 38C28 44.6274 33.3726 50 40 50V62C26.7452 62 16 51.2548 16 38C16 24.7452 26.7452 14 40 14V26Z", fill: DARK },
    { tag: "path", d: "M40 26C46.6274 26 52 31.3726 52 38C52 44.6274 46.6274 50 40 50V26Z", fill: LIGHT },
  ],
  // General management: a play arrow with a lighter arrowhead inside it.
  play: [
    disc(BASE),
    { tag: "path", d: "M56.7467 25.0962L0.808983 -7.19943C-9.12435 -12.9344 -21.541 -5.76566 -21.541 5.70437V70.2956C-21.541 81.7657 -9.12433 88.9344 0.809004 83.1994L56.7467 50.9038C66.68 45.1688 66.68 30.8312 56.7467 25.0962Z", fill: DARK },
    { tag: "path", d: "M21.0574 37.0541L-51.329 12.2102C-52.6273 11.7646 -53.9783 12.7293 -53.9783 14.1018V61.8981C-53.9783 63.2707 -52.6273 64.2354 -51.329 63.7898L21.0574 38.9458C21.9579 38.6368 21.9579 37.3632 21.0574 37.0541Z", fill: BASE },
    { tag: "path", d: "M49.7221 37.134C50.3888 37.5189 50.3888 38.4812 49.7221 38.8661L30.8768 49.7462C30.1041 50.1923 29.1783 49.4799 29.4116 48.6187L32.2886 38.0001L29.4116 27.3814C29.1783 26.5202 30.1041 25.8078 30.8768 26.2539L49.7221 37.134Z", fill: LIGHT },
  ],
  // Executive Leadership: three stacked blocks stepping up to the right.
  blocks: [
    disc(BASE),
    { tag: "rect", x: 16, y: 38, width: 24, height: 24, rx: 1, fill: DARK },
    { tag: "rect", x: 4, y: 50, width: 24, height: 24, rx: 1, fill: DARK },
    { tag: "rect", x: 28, y: 26, width: 24, height: 24, rx: 1, fill: LIGHT },
    { tag: "path", d: "M28 38H39C39.5523 38 40 38.4477 40 39V50H29C28.4477 50 28 49.5523 28 49V38Z", fill: BASE },
  ],
  // Practical Healthcare (and the library's placeholder): a cross with squares in the corners.
  plus: [
    disc(DARK),
    { tag: "path", d: "M45 20C45.5523 20 46 20.4477 46 21V32H57C57.5523 32 58 32.4477 58 33V43C58 43.5523 57.5523 44 57 44H46V55C46 55.5523 45.5523 56 45 56H35C34.4477 56 34 55.5523 34 55V44H23C22.4477 44 22 43.5523 22 43V33C22 32.4477 22.4477 32 23 32H34V21C34 20.4477 34.4477 20 35 20H45Z", fill: LIGHT },
    { tag: "rect", x: 58, y: 56, width: 22, height: 22, rx: 1, fill: BASE },
    { tag: "rect", x: 58, y: -2, width: 22, height: 22, rx: 1, fill: BASE },
    { tag: "rect", x: 0, y: -2, width: 22, height: 22, rx: 1, fill: BASE },
    { tag: "rect", x: 0, y: 56, width: 22, height: 22, rx: 1, fill: BASE },
  ],
  // Public policy: two dark books toppling against a light upright one, the
  // outer book running off the disc. The library's SVG export of this symbol
  // returns the placeholder, so the rectangles come from the node's own
  // geometry: 12x36 books at 30 and 45 degrees, placed by the centres of
  // their bounding boxes.
  books: [
    disc(BASE),
    { tag: "rect", x: 44, y: 22, width: 12, height: 32, rx: 1, fill: LIGHT },
    { tag: "rect", x: 44, y: 20, width: 12, height: 36, rx: 1, fill: LIGHT },
    { tag: "rect", x: 23.8, y: 19.41, width: 12, height: 36, rx: 1, fill: DARK, transform: "rotate(30 29.8 37.41)" },
    { tag: "rect", x: 3.87, y: 21.03, width: 12, height: 36, rx: 1, fill: DARK, transform: "rotate(45 9.87 39.03)" },
  ],
}
