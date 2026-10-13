import { buildSnippet } from "../../../../components/collection-tiles-ii/snippet"

/** The snippet as a downloadable file, built once at deploy time. */
export const dynamic = "force-static"

export function GET() {
  return new Response(buildSnippet(), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-disposition": 'attachment; filename="collection-tiles.html"',
    },
  })
}
