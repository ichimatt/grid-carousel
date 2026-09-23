/**
 * The design system's keyboard focus ring (Figma "focus-ring" effect): 1px of
 * white, then 2px of #1794ff beyond it (the effect's 1px and 3px spreads),
 * shown on :focus-visible only, with a plain outline in forced-colours mode
 * where box shadows are dropped.
 */
export const focusRing =
  "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1 focus-visible:ring-offset-white focus-visible:outline-none forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2"
