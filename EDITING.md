# Editing your website

## A map of the project

| Change | File |
| --- | --- |
| Name, email, links, Calendly | `src/data/site.json` |
| Main research introduction | `src/content/home.md` |
| Research interests | `src/content/research.md` |
| Previous collaborations | `src/content/background.md` |
| Add or update a publication | `src/content/papers/*.md` |
| Add or update a blog post | `src/content/posts/*.md` |
| News, talks, visits, service | `src/data/news.json` |
| Bookshelf | `src/data/books.json` |
| Longer music/outdoors/reading descriptions | `src/data/interests.json`; personal page at `src/pages/about/index.astro` |
| Sidebar and page metadata | `src/layouts/Base.astro` |
| Homepage sections / direction links | `src/pages/index.astro` |
| Colours, spacing, responsive layout | `src/styles/global.css` |
| Reusable image, paper, video components | `src/components/` |

Save, run `npm run build`, then `npm run check:links`. These checks catch malformed content and missing local destinations before deployment.

## Add a blog post

```sh
npm run new:post -- "A question worth keeping"
```

Open the new file in `src/content/posts/`. It looks like:

```md
---
title: "A question worth keeping"
description: "A one-sentence description."
date: 2026-11-08
category: Notes
tags: [Representations, Learning]
draft: true
---

Start with the question.

## A section

Write text, add links, and use normal Markdown.
```

Change the date to the date you want, finish the body, and set `draft: false`. The listing, search index, sitemap, reading time, and table of contents update automatically. Heading level 2 (`##`) creates table-of-contents links.

Images can use relative paths. From a post at `/writing/your-title/`, `../../media/your-photo-960.webp` resolves from the domain root. For advanced interactive articles, create an `.astro` page or add MDX as a future integration; standard Markdown posts need no additional dependencies.

## Add a paper

```sh
npm run new:paper -- "A new paper title"
```

Edit every sample field in the generated Markdown file. Add the paper PDF and BibTeX under `public/docs/` and `public/bibs/` and use their paths without a leading slash. Add a thumbnail to `public/imgs/` and run `npm run media`; the `image` field is its filename without the extension. Reusing an existing image name is fine while drafting.

```yaml
title: "A new paper title"
year: 2026
venue: NeurIPS
authors: [Ching Lam Choi, Another Author]
summary: "One or two sentences explaining the result."
topics: [Synthetic data, Representation learning]
image: my-paper
pdf: docs/my-paper.pdf
bib: bibs/my-paper.bib
featured: true
oral: false
order: 0
draft: false
```

The Markdown body is the paper overview page. `featured: true` adds the paper to the homepage; `order` controls ordering, with smaller numbers first. Papers automatically receive `/papers/<filename>/` routes and appear in filters/search. Topics are taken from your data, so new topics require no filter-code edits.

Optionally add `project: papers/my-project/` when you have a richer project page. This changes the main title link and adds a Project resource; the overview page remains available. For the existing noise project this is `papers/noiseAudits/`.

Add coauthor profile URLs in `src/data/people.json`. Authors without a URL are rendered as plain text.

## Add a news item

Add an object at the start of `src/data/news.json`:

```json
{
  "label": "Talk 08.11.2026 @MIT",
  "category": "Talks",
  "date": "2026-11-08",
  "html": "Presented <a href=\"https://example.com\">a talk</a> at MIT.",
  "text": "Presented a talk at MIT."
}
```

Categories currently are `Talks`, `Milestones`, and `Community`. Dates sort the archive; the homepage shows the latest three dated items. For a multi-day event, use the first date for sorting and add `displayDate`, for example `Jun 28–Jul 3, 2026`. Undated service entries use an empty `date`. Existing ranges have been retained.

## Connect Calendly

Open `src/data/site.json` and change:

```json
"bookingUrl": "https://calendly.com/YOUR-NAME/YOUR-EVENT"
```

When the value is empty, visitors see “Calendar coming soon” and an email alternative. Once it is a real URL, the page displays a booking button. The calendar opens externally, so no Calendly scripts or cookies are loaded when someone merely visits the website.

The email form drafts a message in the visitor's own mail app. It never submits to a server or books time automatically.

## Add multimedia efficiently

For an Astro paper or custom page:

```astro
---
import Media from '../components/Media.astro';
---
<Media title="A short demonstration" video="media/demo.mp4" poster="media/demo-poster.webp" />
<Media title="A talk recording" youtubeId="VIDEO_ID_11" poster="media/talk-poster.webp" />
<Media title="Audio recording" audio="media/recording.mp3" />
```

Adjust the import path for the page's location. Put media files under `public/media/`. Supply a compressed poster with dimensions suited to the display. Use MP4/WebM for video; avoid large GIFs. Native video/audio do not preload; YouTube embeds are created only on click. Keep a transcript or captions with new recordings so they remain accessible.

For ordinary images use `Photo.astro`: it reads dimensions and variants from `src/data/media.json`. Only the above-the-fold portrait and paper hero request priority loading; other images are lazy. It uses local files, not an image CDN. For a new photo family add it through the media helper, and adjust the generated sizes if appropriate.

## Add a new section or page

Create `src/pages/your-page.astro` and reuse `Base.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Your page">
  <header class="page-heading"><h1>Your page</h1><p>A short introduction.</p></header>
  <section><h2>A section</h2><p>Your content.</p></section>
</Base>
```

Add a navigation entry to `nav` in `Base.astro`. Shared styles and mobile navigation carry over. Internal links should use the `href()` helper in `src/lib/site.ts` so links remain consistent with the configured base path.

## Deployment choices

Publish this source at the root of `chinglamchoi/chinglamchoi.github.io` to use `https://chinglamchoi.github.io/`. The editable source requires a build. Use the included GitHub Actions workflow and select GitHub Actions in Pages settings. Do not upload `node_modules/`, and do not move the source under another folder inside the repository.

The separate prebuilt archive can be deployed as ordinary static files if you prefer your current branch-based Pages publishing method. Future changes should be made in source, rebuilt, and re-exported—not by editing generated files in `dist/`.

## Change a pattern or photo

Decorative drawings live in `public/patterns/`: `walks`, `waves`, `grid`, `forest`, `books`, and `record`. In an Astro page import `Pattern` from the appropriate `components/Pattern.astro` path and insert `<Pattern name="waves" class="section-pattern"/>`. They are intentionally hidden from screen readers, since they are decorative. For new artwork keep it as a compact SVG without embedded text or external images.

The personal page uses `bouldering` and `reading-wall`; the homepage uses `neckar-wide`, `hilaryHahn`, and `reading-wall`. Change the `name` on `Photo` and its `alt` description together. Extra supplied photo assets include `neckar-flowers`, `painted-vessels`, and `sculpture-study` for later use. Photos appear in context, without a gallery. All responsive variants are local WebP files. The media helper regenerates them from `public/imgs/`.

The primary typeface is set with `--sans:Arial,sans-serif` in `src/styles/global.css`. All visible interface and prose text uses it. The optional monospace face is restricted to code and citations. The noise project has its own stylesheet at `public/papers/noiseAudits/style.css`, also set to Arial.

## Site identity

The logo uses your supplied green Rosetta mark. Original green and light variants are retained under `public/brand/`, with 96px and 192px versions for the interface. The shared layout (`src/layouts/Base.astro`) places it in the mobile header and footer; the sidebar header uses text only. The standalone noise project uses the same mark. Favicon and Apple touch icon files live under `public/favicon/`; the older `public/imgs/favicon/` files are also replaced so previous icon URLs use Rosetta. The supplied colours and transparency are preserved.
