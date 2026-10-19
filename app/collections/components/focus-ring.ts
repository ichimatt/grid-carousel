/**
 * The design system's keyboard focus ring (Figma "focus-ring" effect): 1px of
 * white, then 2px of #1794ff beyond it (the effect's 1px and 3px spreads),
 * shown on :focus-visible only. outline-hidden removes the browser outline
 * but, in forced-colours mode where box shadows are dropped, draws a 2px
 * transparent one 2px out, which the system paints in its own colour.
 */
export const focusRing =
  "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-white focus-visible:outline-hidden"
