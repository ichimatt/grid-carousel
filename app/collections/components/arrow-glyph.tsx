/**
 * A right-pointing chevron drawn with the 2u arrows webfont, which maps ">"
 * to a chevron sitting on the text baseline. The font only has a regular
 * weight, so the glyph keeps weight 400 whatever the surrounding text uses
 * (otherwise the browser would fake a bold). Decorative: the link text
 * carries the meaning. Preceded by a no-break space so it never wraps on
 * its own.
 */
export default function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <>
      {"\u00a0"}
      <span aria-hidden="true" className={`font-arrows font-normal ${className}`}>
        {">"}
      </span>
    </>
  )
}
