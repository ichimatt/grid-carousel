import { readFileSync } from "node:fs"
import path from "node:path"
import {
  constrainedGraphics,
  DISC,
  GRAPHIC_VIEW_BOX,
  type GraphicPrimitive,
} from "./constrained-graphics-data"
import { collectionTiles, type CollectionTileData } from "./tiles"

/**
 * Builds the self-contained HTML, CSS and JavaScript block that reproduces the
 * six-tile carousel without React, Next or Tailwind, for insertion through
 * Optimizely. The stylesheet is this folder's CSS module with its class names
 * prefixed, the markup mirrors CollectionTile and CollectionTileCarousel, and
 * the script is a plain-JS port of the carousel's paging. Server only: it
 * reads the module file at build time.
 */

/** Every class name in the module, prefixed in the snippet so host styles can't collide. */
const PREFIX = "gsct"
const CLASS_NAMES = [
  "root", "slide", "desktopBox", "mobileBox", "track", "runway", "controls", "single",
  "tile", "inner", "hero", "copy", "heading", "kicker", "divider", "headline", "link",
  "chevron", "button", "dot", "arrow", "control",
]
const UNUSED = ["desktopBox", "mobileBox", "single"]
const cls = (name: string) => `${PREFIX}-${name}`

const MODULE_PATH = "app/components/collection-tiles-ii/collection-tile-carousel.module.css"

/** The module stylesheet rewritten for the snippet: prefixed, comments and the review-page-only rules dropped. */
function scopedStylesheet(): string {
  let css = readFileSync(path.join(process.cwd(), MODULE_PATH), "utf8")
  css = css.replace(/\/\*[\s\S]*?\*\//g, "")
  css = css.replace(new RegExp(`(?<![\\w-])\\.(${CLASS_NAMES.join("|")})(?![\\w-])`, "g"), `.${PREFIX}-$1`)
  css = css.replaceAll("--tile-cols", `--${PREFIX}-cols`)
  for (const name of UNUSED) {
    css = css.replace(new RegExp(`\\.${cls(name)}[^{}]*\\{[^{}]*\\}`, "g"), "")
  }
  css = css.replace(/@container[^{]*\{\s*\}/g, "")
  return css.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

/** What the React markup got from Tailwind and the review layout: tokens, resets and the few utility classes. */
const baseStylesheet = `
.${PREFIX} {
  --color-white: #ffffff;
  --color-ink: #082135;
  --color-ink-secondary: #5d6165;
  --color-ink-tertiary: #717579;
  --color-sunken: #f1f4f8;
  --color-line: #dce0e5;
  --color-focus-ring: #1794ff;
  --shadow-elevation-1: 0 2px 4px 0 rgba(30, 33, 37, 0.1);
  --shadow-elevation-outlined-1: 0 0 0 1px rgba(30, 33, 37, 0.04), 0 2px 4px 0 rgba(30, 33, 37, 0.1);
  --shadow-elevation-outlined-2: 0 0 0 1px rgba(30, 33, 37, 0.04), 0 4px 8px 0 rgba(30, 33, 37, 0.1);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-ink);
  -webkit-font-smoothing: antialiased;
}

:where(.${PREFIX} *, .${PREFIX} *::before, .${PREFIX} *::after) {
  box-sizing: border-box;
}

/* Resets for whatever the host page styles these as; :where() keeps them
   below the tile's own rules. */
:where(.${PREFIX} h3, .${PREFIX} p) {
  margin: 0;
  font: inherit;
  color: inherit;
}

:where(.${PREFIX} a) {
  color: inherit;
  text-decoration: none;
}

.${PREFIX}-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem 0;
}

.${PREFIX}-controls {
  order: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.${PREFIX}-dots {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.${PREFIX}-dot,
.${PREFIX}-arrow {
  margin: 0;
  padding: 0;
  border: 0;
  appearance: none;
  -webkit-appearance: none;
  font: inherit;
}

.${PREFIX}-dot {
  position: relative;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
}

.${PREFIX}-dot::after {
  content: "";
  position: absolute;
  inset: -0.5rem;
}

.${PREFIX}-status {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.${PREFIX}-graphic {
  display: block;
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 9999px;
  box-shadow: var(--shadow-elevation-1);
}

.${PREFIX}-icon {
  flex: none;
}
`.trim()

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function primitive(shape: GraphicPrimitive): string {
  const { tag, ...attrs } = shape
  const list = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")
  return `<${tag} ${list}/>`
}

function graphic(tile: CollectionTileData, index: number): string {
  const clipId = `${PREFIX}-clip-${index + 1}`
  const discAttrs = Object.entries(DISC).map(([key, value]) => `${key}="${value}"`).join(" ")
  return [
    `<svg class="${cls("graphic")}" viewBox="${GRAPHIC_VIEW_BOX}" aria-hidden="true" focusable="false">`,
    `<clipPath id="${clipId}"><rect ${discAttrs}/></clipPath>`,
    `<g clip-path="url(#${clipId})">${constrainedGraphics[tile.graphic].map(primitive).join("")}</g>`,
    `</svg>`,
  ].join("")
}

const CHEVRON = `<svg class="${cls("chevron")}" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M6 12L10 8L6 4"/></svg>`
const BUTTON_CHEVRON = `<svg class="${cls("icon")}" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7.5 15L12.5 10L7.5 5"/></svg>`
const ARROW_LEFT = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12.5 15L7.5 10L12.5 5"/></svg>`
const ARROW_RIGHT = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7.5 15L12.5 10L7.5 5"/></svg>`

function arrowMarkup(direction: "previous" | "next", trackId: string): string {
  const label = direction === "previous" ? "Previous page" : "Next page"
  return `<button type="button" class="${cls("control")} ${cls("arrow")}" data-step="${direction === "previous" ? -1 : 1}" aria-label="${label}" aria-controls="${trackId}" aria-disabled="${direction === "previous"}">${direction === "previous" ? ARROW_LEFT : ARROW_RIGHT}</button>`
}

function tileMarkup(tile: CollectionTileData, index: number, count: number): string {
  const theme = [
    `--theme-bg:${tile.theme.bg}`,
    `--theme-symbol-light:${tile.theme.symbolLight}`,
    `--theme-symbol:${tile.theme.symbol}`,
    `--theme-symbol-dark:${tile.theme.symbolDark}`,
    `--theme-text:${tile.theme.text}`,
  ].join(";")
  return `
    <div class="${cls("slide")}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${count}">
      <a class="${cls("tile")}" href="${escapeHtml(tile.href)}" style="${theme}">
        <div class="${cls("inner")}">
          <div class="${cls("hero")}">${graphic(tile, index)}</div>
          <div class="${cls("copy")}">
            <div class="${cls("heading")}">
              <p class="${cls("kicker")}">${escapeHtml(tile.name)}</p>
              <span class="${cls("divider")}" aria-hidden="true">•</span>
              <h3 class="${cls("headline")}">${escapeHtml(tile.headline)}</h3>
            </div>
            <p class="${cls("link")}"><span>${escapeHtml(tile.courseCount)}</span>${CHEVRON} <span class="${cls("button")}">${escapeHtml(tile.cta)}${BUTTON_CHEVRON}</span></p>
          </div>
        </div>
      </a>
    </div>`
}

function dotMarkup(tile: CollectionTileData, index: number, count: number, trackId: string): string {
  const current = index === 0 ? ` aria-current="true"` : ""
  return `<button type="button" class="${cls("dot")}" aria-label="Go to tile ${index + 1} of ${count}: ${escapeHtml(tile.headline)}" aria-controls="${trackId}"${current}></button>`
}

/** The carousel's paging in plain JavaScript: the same rules as the React component. */
const script = String.raw`
(function () {
  var SETTLE = 1500, IDLE = 160;
  var roots = document.querySelectorAll(".gsct-root");
  Array.prototype.forEach.call(roots, function (root) {
    if (root.hasAttribute("data-ready")) return;
    root.setAttribute("data-ready", "");
    var track = root.querySelector(".gsct-track");
    var dotsGroup = root.querySelector(".gsct-dots");
    var arrows = Array.prototype.slice.call(root.querySelectorAll(".gsct-arrow"));
    var status = root.querySelector(".gsct-status");
    var slides = Array.prototype.slice.call(track.children);
    var titles = slides.map(function (slide) { var h = slide.querySelector("h3"); return h ? h.textContent.trim() : ""; });
    var count = slides.length;
    var page = 0, perView = 1, pending = null, settleTimer = 0, idleTimer = 0, frame = 0, swipe = false, announced = -1, seq = 0;
    var dots = [];

    function positions() {
      var max = track.scrollWidth - track.clientWidth;
      var rtl = getComputedStyle(track).direction === "rtl";
      var min = rtl ? -max : 0, lim = rtl ? 0 : max;
      var origin = slides[0].getBoundingClientRect().left;
      return slides.map(function (slide) { return Math.min(lim, Math.max(min, slide.getBoundingClientRect().left - origin)); });
    }
    function layout() {
      var per = Math.max(1, Math.round(parseFloat(getComputedStyle(track).getPropertyValue("--gsct-cols"))) || 1);
      var pos = positions();
      if (track.scrollWidth - track.clientWidth < 1) return { per: per, pages: [pos[0]] };
      if (per === 1) return { per: per, pages: pos };
      var pages = [];
      for (var i = 0; i < pos.length; i += per) {
        var last = pages[pages.length - 1];
        if (last === undefined || Math.abs(pos[i] - last) > 1) pages.push(pos[i]);
      }
      return { per: per, pages: pages };
    }
    function nearest(pages, x) {
      var n = 0;
      for (var i = 1; i < pages.length; i++) if (Math.abs(pages[i] - x) < Math.abs(pages[n] - x)) n = i;
      return n;
    }
    function resolve(pages, x, current) {
      var n = nearest(pages, x);
      return current >= 0 && current < pages.length && Math.abs(pages[current] - pages[n]) < 1 ? current : n;
    }
    function clearPending() { pending = null; clearTimeout(settleTimer); }
    function setCurrent(next) {
      page = next;
      dots.forEach(function (dot, i) { if (i === next) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current"); });
    }
    function setEdges() {
      var max = track.scrollWidth - track.clientWidth;
      arrows.forEach(function (arrow) {
        var atEnd = arrow.getAttribute("data-step") === "-1" ? track.scrollLeft <= 1 : track.scrollLeft >= max - 1;
        arrow.setAttribute("aria-disabled", atEnd ? "true" : "false");
      });
    }
    function step(direction) {
      var l = layout();
      var here = track.scrollLeft;
      var target = direction === 1 ? l.pages.length - 1 : 0;
      if (direction === 1) {
        for (var i = 0; i < l.pages.length; i++) if (l.pages[i] > here + 1) { target = i; break; }
      } else {
        for (var j = 0; j < l.pages.length; j++) if (l.pages[j] < here - 1) target = j;
      }
      goTo(target, false);
    }
    function renderDots(pages, per) {
      perView = per;
      dotsGroup.textContent = "";
      dots = pages.map(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gsct-dot";
        dot.setAttribute("aria-label", per === 1 ? "Go to tile " + (i + 1) + " of " + pages.length + ": " + (titles[i] || "") : "Go to page " + (i + 1) + " of " + pages.length);
        dot.setAttribute("aria-controls", track.id);
        dot.addEventListener("click", function () { goTo(i, false); });
        dotsGroup.appendChild(dot);
        return dot;
      });
      dotsGroup.parentNode.hidden = pages.length < 2;
    }
    function announce(target, pages, per) {
      announced = target;
      var first = titles[Math.min(target * per, count - 1)] || "";
      status.textContent = (per === 1 ? "Tile " + (target + 1) + " of " + pages.length + ": " + first : "Page " + (target + 1) + " of " + pages.length) + (++seq % 2 ? " " : "");
    }
    function sync() {
      var l = layout();
      if (l.pages.length !== dots.length || l.per !== perView) { renderDots(l.pages, l.per); setCurrent(Math.min(page, l.pages.length - 1)); }
      setEdges();
      if (pending !== null) {
        var target = Math.min(pending, l.pages.length - 1);
        if (Math.abs(track.scrollLeft - l.pages[target]) >= 2) return;
        clearPending();
      }
      var next = l.per === 1 ? resolve(l.pages, track.scrollLeft, page) : nearest(l.pages, track.scrollLeft);
      if (next !== page) setCurrent(next);
    }
    function goTo(target, quiet) {
      var l = layout();
      var next = Math.max(0, Math.min(target, l.pages.length - 1));
      clearPending();
      pending = next;
      setCurrent(next);
      if (!quiet) announce(next, l.pages, l.per);
      swipe = false;
      settleTimer = setTimeout(function () { pending = null; sync(); }, SETTLE);
      track.scrollTo({ left: l.pages[next] });
    }
    function settle() {
      clearPending();
      var wasSwipe = swipe;
      swipe = false;
      sync();
      if (wasSwipe && page !== announced) { var l = layout(); announce(page, l.pages, l.per); }
    }
    function startSwipe() { swipe = true; clearPending(); }

    arrows.forEach(function (arrow) {
      arrow.addEventListener("click", function () {
        if (arrow.getAttribute("aria-disabled") === "true") return;
        step(arrow.getAttribute("data-step") === "-1" ? -1 : 1);
      });
    });
    track.addEventListener("focusin", function (event) {
      var slide = event.target.closest("[aria-roledescription=slide]");
      if (!slide) return;
      var index = slides.indexOf(slide);
      if (index === -1) return;
      var l = layout();
      var target = Math.min(Math.floor(index / l.per), l.pages.length - 1);
      if (target !== page || Math.abs(track.scrollLeft - l.pages[target]) > 1) goTo(target, true);
    });
    var hasScrollEnd = "onscrollend" in window;
    track.addEventListener("scroll", function () {
      if (!hasScrollEnd) { clearTimeout(idleTimer); idleTimer = setTimeout(settle, IDLE); }
      if (frame) return;
      frame = requestAnimationFrame(function () { frame = 0; sync(); });
    }, { passive: true });
    if (hasScrollEnd) track.addEventListener("scrollend", settle);
    track.addEventListener("pointerdown", startSwipe, { passive: true });
    track.addEventListener("touchstart", startSwipe, { passive: true });
    track.addEventListener("wheel", startSwipe, { passive: true });

    var width = track.clientWidth;
    new ResizeObserver(function () {
      if (track.clientWidth === width) return;
      width = track.clientWidth;
      clearPending();
      var l = layout();
      var target = Math.min(page, l.pages.length - 1);
      track.scrollTo({ left: l.pages[target], behavior: "instant" });
      renderDots(l.pages, l.per);
      setCurrent(target);
      sync();
    }).observe(track);

    var initial = layout();
    renderDots(initial.pages, initial.per);
    setCurrent(0);
    setEdges();
    root.setAttribute("data-measured", "");
  });
})();
`.trim()

/** The whole block, ready to paste. The homepage ground is white, so the arrows take the library's onSunken=false fills. */
export function buildSnippet(items: CollectionTileData[] = collectionTiles): string {
  const count = items.length
  const trackId = `${PREFIX}-track`
  const dataCount = count === 1 ? "one" : count === 2 ? "two" : count === 3 ? "three" : "many"
  const header = [
    `<!-- GetSmarter collection tiles · self-contained snippet (HTML + CSS + JS).`,
    `     Generated from the component review build; paste it where the tiles`,
    `     should appear. The page must have Noto Sans available. Set each tile's`,
    `     href to its collection page before launching. -->`,
  ].join("\n")
  return `${header}
<style>
${baseStylesheet}

${scopedStylesheet()}
</style>
<section class="${PREFIX} ${cls("root")}" aria-roledescription="carousel" aria-label="Course collections" data-count="${dataCount}" data-ground="white">
  <div class="${cls("body")}">
    <div class="${cls("controls")}">
      ${arrowMarkup("previous", trackId)}
      <div class="${cls("dots")}" role="group" aria-label="Choose a page">
        ${items.map((tile, index) => dotMarkup(tile, index, count, trackId)).join("\n        ")}
      </div>
      ${arrowMarkup("next", trackId)}
    </div>
    <p class="${cls("status")}" role="status" aria-atomic="true"></p>
    <div class="${cls("runway")}">
      <div class="${cls("track")}" id="${trackId}" role="group" aria-label="Course collections" style="--count:${count}">${items.map((tile, index) => tileMarkup(tile, index, count)).join("")}
      </div>
    </div>
  </div>
</section>
<script>
${script}
</script>
`
}
