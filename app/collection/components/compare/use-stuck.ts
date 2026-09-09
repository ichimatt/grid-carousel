"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Tracks whether a sticky bar is currently stuck under the fixed page header,
 * via a sentinel element rendered just above the bar. Only used below the
 * desktop breakpoint, where the fixed header is 56px tall.
 */
export function useStuck(headerHeight = 56) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) =>
        setStuck(
          !entry.isIntersecting && entry.boundingClientRect.top < headerHeight + 1
        ),
      { rootMargin: `-${headerHeight + 1}px 0px 0px 0px` }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [headerHeight])

  return { sentinelRef, stuck }
}
