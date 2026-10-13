"use client"

import { useEffect, useState } from "react"
import { focusRing } from "../../../collections/components/focus-ring"

/** Copies the snippet to the clipboard and says so for a moment. */
export default function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")

  useEffect(() => {
    if (state === "idle") return
    const timer = window.setTimeout(() => setState("idle"), 2000)
    return () => window.clearTimeout(timer)
  }, [state])

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setState("copied")
        } catch {
          setState("failed")
        }
      }}
      className={`inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm/5 font-medium text-white transition-colors hover:bg-[#0c2f4b] ${focusRing}`}
    >
      {state === "copied" ? "Copied" : state === "failed" ? "Select and copy the code below" : "Copy snippet"}
      <span role="status" className="sr-only">
        {state === "copied" ? "Snippet copied to the clipboard" : ""}
      </span>
    </button>
  )
}
