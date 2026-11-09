# Ching Lam Choi — personal website

An editable Astro website for `https://chinglamchoi.github.io/`. A charcoal and plum palette, restrained colour for research themes, Arial throughout, larger type, and a shared navigation across research, writing, news, coffee hours, and personal interests.

## Start locally

Use **Node 22.12 or newer**. This project is locked to Astro 6.4.8; Node 22.19.0 was used for validation.

```sh
npm ci
npm run dev
```

Open the Local URL printed in the terminal, at `/`. For a production preview:

```sh
npm run build
npm run check:links
npm run preview
```

The website is statically generated. It needs no database, runtime server, account, or paid service.

## Edit content

See **[EDITING.md](EDITING.md)** for recipes and a map of every editable file.

- **Bio:** `src/content/home.md`, `src/content/background.md`, and `src/content/research.md`.
- **Name, email, external profiles, Calendly:** `src/data/site.json`.
- **Papers:** one Markdown file per paper in `src/content/papers/`.
- **Blog:** one Markdown file per post in `src/content/posts/`.
- **News and talks:** `src/data/news.json`.
- **Books / interests:** `src/data/books.json` and `src/data/interests.json`.
- **Visual style:** `src/styles/global.css`.

Create a draft without touching a layout:

```sh
npm run new:post -- "My next note"
npm run new:paper -- "My next paper"
```

Drafts do not appear on the public site or in search. Set `draft: false` when ready.

## Publish to GitHub Pages

To publish at **https://chinglamchoi.github.io/**, put this source at the root of the **`chinglamchoi/chinglamchoi.github.io`** repository (the user-site repository). This target differs from the earlier `chinglamchoi/cchoi` project repository. Keep any existing `.git` directory and back up existing files before replacing them. Include the hidden `.github/` directory. Commit and push to `main`.

In GitHub **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow builds and checks the site, then deploys `dist/`. It runs on pushes to `main` and can also be started manually. The homepage is `/`; generated paper overviews are `/papers/<slug>/`; the interactive noise project is `/papers/noiseAudits/`. PDF and BibTeX downloads are under `/docs/` and `/bibs/`. Links to the old `/cchoi/` deployment are not redirected by this new repository.

If you prefer to publish the supplied prebuilt archive, extract it at the root of your branch-based Pages publishing source, include `.nojekyll`, and retain your existing branch-based Pages setting. Do not mix this with the source workflow unless you intentionally change the deployment method.

For a different repository name or custom domain, change `site` and `base` in `astro.config.mjs`, update `public/robots.txt`, and update `base` in `scripts/check-links.mjs` before rebuilding.

## Included features

- Search across papers, writing and pages with `/` or Ctrl/Cmd K.
- Publication topic/year/text filters with shareable URLs, list/gallery views, citation dialog and copy.
- Individual paper pages, a blog with in-page contents, a filterable news archive, and a filterable bookshelf.
- Coffee page with a clear Calendly placeholder and an email draft form. Add the real booking URL in the settings file.
- Responsive layouts, mobile navigation, keyboard controls, reduced-motion support, and useful content without JavaScript.
- Responsive WebP images with explicit dimensions, lazy loading, and no remote font dependency.
- A reusable multimedia component; third-party video players load only after a click, and native video/audio use `preload="none"`.

Writing currently shows “Coming soon”. The sample research note is retained as an unpublished draft for later editing. Set its `draft` field to `false` to publish it. The coffee calendar is deliberately not connected to a booking provider yet.

## Media

Original images remain in `public/imgs/` for future editing and reuse. Pages use optimized variants in `public/media/`. PDF downloads remain in `public/docs/` and are not loaded in the background.

To regenerate responsive images after editing originals, install Pillow for Python and run:

```sh
python3 -m pip install Pillow
npm run media
npm run build
```

You do not need Python to install, run, or build the existing website. It is only used for optional image regeneration.

## Source and provenance

Biographical details, eight papers, existing dated talks and service entries, personal interests, and original photos were migrated from the supplied website. The prior interactive Shaping Useful Noise page is included under `public/papers/noiseAudits/`. Reference sites informed the navigation and content organisation; their layouts and source were not copied.

The live website has not been changed. Earlier repository write access returned HTTP 403, so this package is ready for review and deployment by the repository owner.

## Patterns and photos

The optional word-free patterns in `public/patterns/` are lightweight SVG redrawings inspired by the drawings you supplied. Change their stroke colours in any text editor; use them with `Pattern.astro`. They contain no font or bitmap dependency. `src/styles/global.css` uses Arial for all interface and reading text; code samples use the platform monospace font. Browser font fallback covers characters unavailable in Arial.

Book and record drawings accompany the corresponding interest sections. The portrait and main navigation have no decorative pattern. Selected supplied photographs are placed in the Outdoors and Reading sections and the homepage interest links. There is no photo gallery. Other supplied photos are retained as optimized assets for future use, without adding them to the layout. Image descriptions avoid inventing museum attribution or dates.
