/** Geometry helpers shared by the scroll-snap carousels. */

/**
 * Snap position of every slide in a scroll-snap track, from live geometry so
 * it survives resizes. Clamped to the scrollable range (in either writing
 * direction), so the last few slides can share a position when the track is
 * wider than one slide.
 */
export function getPositions(track: HTMLElement): number[] {
  const slides = Array.from(track.children)
  if (slides.length === 0) return [0]
  const maxScroll = track.scrollWidth - track.clientWidth
  const [min, max] =
    getComputedStyle(track).direction === "rtl" ? [-maxScroll, 0] : [0, maxScroll]
  const origin = slides[0].getBoundingClientRect().left
  return slides.map((slide) =>
    Math.min(max, Math.max(min, slide.getBoundingClientRect().left - origin))
  )
}

/** Index of the position nearest a scroll offset. */
export function nearestIndex(positions: number[], scrollLeft: number): number {
  let nearest = 0
  for (let i = 1; i < positions.length; i++) {
    if (
      Math.abs(positions[i] - scrollLeft) <
      Math.abs(positions[nearest] - scrollLeft)
    ) {
      nearest = i
    }
  }
  return nearest
}

/**
 * The slide nearest a scroll offset. When several slides share that offset
 * (the end of a wide track), the slide we were already on wins so a dot the
 * user chose, or the slide they had before a resize, isn't reported as its
 * neighbour.
 */
export function resolveIndex(positions: number[], scrollLeft: number, current: number): number {
  const nearest = nearestIndex(positions, scrollLeft)
  if (
    current >= 0 &&
    current < positions.length &&
    Math.abs(positions[current] - positions[nearest]) < 1
  ) {
    return current
  }
  return nearest
}
