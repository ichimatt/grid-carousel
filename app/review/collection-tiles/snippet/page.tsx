import type { Metadata } from "next"
import { buildSnippet } from "../../../components/collection-tiles-ii/snippet"
import CopyButton from "./copy-button"
import SnippetPreview from "./snippet-preview"

export const metadata: Metadata = {
  title: "Collection tiles snippet",
}

/** Page padding, matched by every element that isn't full-bleed. */
const GUTTER = "px-6 lg:px-10"
/** The design's line colour, separating an artboard from the page that shares its background. */
const FRAME = "border-line"

const snippet = buildSnippet()

/** A bare host document for the preview: the page background and Noto Sans, nothing else. */
const previewDocument = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600&display=swap">
<style>html, body { margin: 0; background: #f1f4f8; }</style>
</head>
<body>
${snippet}
</body>
</html>`

export default function CollectionTilesSnippetPage() {
  return (
    <main className="flex flex-col gap-12 py-10">
      <header className={`max-w-2xl ${GUTTER}`}>
        <p className="text-sm/5 font-medium text-ink-secondary">Component review</p>
        <h1 className="mt-1 text-2xl/8 font-semibold">Collection tiles snippet</h1>
        <p className="mt-3 text-base/6 text-ink-secondary">
          The six-tile carousel as one self-contained block of HTML, CSS and
          JavaScript, with no dependency on this site&apos;s code, for an
          Optimizely experiment. It is generated from the same data and
          stylesheet as the review page, so the two stay in step.
        </p>
      </header>

      <section aria-labelledby="snippet-notes" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="snippet-notes" className="text-lg/6 font-semibold">
            Before inserting
          </h2>
        </div>
        <ul role="list" className={`flex max-w-3xl list-disc flex-col gap-2 pl-5 text-sm/5 text-pretty text-ink-secondary ${GUTTER}`}>
          <li>
            Insert the whole block as HTML where the tiles should appear. The
            script at the end sets up the dots and arrows; if your Insert HTML
            change strips scripts, paste that part into the experiment&apos;s
            custom JavaScript instead. Without it the tiles still scroll and
            snap, with no controls.
          </li>
          <li>
            Every tile links to <code className="font-mono">#</code>. Set each
            href to its collection page.
          </li>
          <li>
            Type is set to Noto Sans with system fallbacks; the host page
            provides the font. The carousel measures its own width, so it
            adapts wherever it is placed. Class names are prefixed{" "}
            <code className="font-mono">gsct-</code> and nothing leaks outside
            the block.
          </li>
        </ul>
      </section>

      <section aria-labelledby="snippet-preview" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${GUTTER}`}>
          <h2 id="snippet-preview" className="text-lg/6 font-semibold">
            Live preview
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            The snippet below, running in its own document. Full width first,
            then in a 360px frame. Resize the window to see it reflow.
          </p>
        </div>
        <div className={`border-y ${FRAME}`}>
          <SnippetPreview document={previewDocument} title="Snippet preview, full width" />
        </div>
        <div className={GUTTER}>
          <div className={`w-[362px] max-w-full overflow-clip rounded-lg border ${FRAME}`}>
            <SnippetPreview document={previewDocument} width={360} title="Snippet preview, 360px" />
          </div>
        </div>
      </section>

      <section aria-labelledby="snippet-code" className="flex flex-col gap-4">
        <div className={`flex flex-wrap items-center gap-x-3 gap-y-3 ${GUTTER}`}>
          <h2 id="snippet-code" className="text-lg/6 font-semibold">
            Snippet
          </h2>
          <p className="max-w-3xl text-sm/5 text-pretty text-ink-secondary">
            {snippet.split("\n").length} lines · {(snippet.length / 1024).toFixed(0)} KB
          </p>
          <div className="flex items-center gap-3 sm:ml-auto">
            <CopyButton text={snippet} />
            <a
              href="/review/collection-tiles/snippet/collection-tiles.html"
              download="collection-tiles.html"
              className="text-sm/5 font-medium text-ink underline underline-offset-4"
            >
              Download .html
            </a>
          </div>
        </div>
        <div className={GUTTER}>
          <pre
            tabIndex={0}
            className={`max-h-[70vh] overflow-auto rounded-lg border bg-white p-4 font-mono text-xs/5 text-ink ${FRAME}`}
          >
            <code>{snippet}</code>
          </pre>
        </div>
      </section>
    </main>
  )
}
