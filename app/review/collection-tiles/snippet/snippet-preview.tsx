"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Renders the snippet in its own document, exactly as a host page would
 * receive it: no React, no Tailwind, none of this page's styles. The frame
 * follows its content's height.
 */
export default function SnippetPreview({
  document: doc,
  width,
  title,
}: {
  document: string
  width?: number
  title: string
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [height, setHeight] = useState(360)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let observer: ResizeObserver | undefined
    const watch = () => {
      const body = frame.contentDocument?.body
      if (!body) return
      observer?.disconnect()
      observer = new ResizeObserver(() => setHeight(body.scrollHeight))
      observer.observe(body)
      setHeight(body.scrollHeight)
    }
    frame.addEventListener("load", watch)
    if (frame.contentDocument?.readyState === "complete") watch()
    return () => {
      frame.removeEventListener("load", watch)
      observer?.disconnect()
    }
  }, [doc])

  return (
    <iframe
      ref={frameRef}
      title={title}
      srcDoc={doc}
      style={{ width: width ?? "100%", height }}
      className="block max-w-full border-0 bg-white"
    />
  )
}
