# Visual rules

Read this before writing the HTML. The page is a **picture book**, not documentation.

## Shape

- 5–8 full-viewport **slides**, stacked vertically (one idea per slide).
- Each slide: one giant picture (inline SVG or CSS shapes) + **at most 12 words**.
- First slide: the topic in kid words + one hero picture.
- Middle slides: the moving parts, in order.
- Last slide: one-line recap. No "in conclusion" essay.
- Phone-safe: readable at 390px wide. No horizontal scroll. Labels `clamp()` to stay huge.

## Pictures

- Draw the analogy. DNS is a phone book. A mutex is a bathroom lock. Git rebase is pulling Lego bricks off a stack and snapping them onto another.
- Simple geometry: blobs, arrows, houses, labeled boxes, stick characters.
- No photos, no icon fonts, no external images, no charts, no code screenshots.
- Emoji is an accent, not the illustration.
- Motion: optional CSS only (a bob, a draw-on arrow). Nothing that requires JS.

## Type and color

- Labels are huge. If body copy is tempting, delete it and make the picture do the work.
- One typeface, system stack. No webfonts.
- Three colors plus paper: one background, one ink, one loud accent. High contrast.
- Paper/cream or ink-dark background. Not a purple-gradient SaaS landing page.

## Hard no

- Paragraphs, bullet essays, tables of contents, nav bars, footers, "learn more".
- Syntax-highlighted code as the explanation (a tiny 2–3 token sticker is ok if the topic *is* that token).
- Framework markup, build steps, `localhost`, or a README next to the HTML.
- Walls of comment-in-HTML.

## File

```html
<!doctype html>
<html lang="…">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ELI5: {topic}</title>
    <style>/* all CSS here */</style>
  </head>
  <body>
    <!-- slides + inline SVG -->
  </body>
</html>
```

Zero network requests. One file. Open in any browser.
