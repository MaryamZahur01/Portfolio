# Maryam Zahoor · Portfolio

Static site (HTML, CSS, JS). No build step. Works on GitHub Pages as is.

## Go live on GitHub Pages (screenshots are taken automatically)
1. Create a new repository, e.g. `maryamzahoor.github.io`.
2. Upload **everything inside this folder** to the repo root, including the hidden
   `.github` folder and `.nojekyll`. (Easiest: GitHub Desktop, or drag the files in
   the web uploader with "show hidden files" turned on.)
3. Repo **Settings → Pages → Source: GitHub Actions**.
4. Repo **Settings → Actions → General → Workflow permissions: Read and write** → Save.
5. Open the **Actions** tab. The "Screenshots + deploy" job runs by itself (or press
   **Run workflow**). In about 5 minutes it opens every project link in a real browser,
   saves the real homepage screenshot, pulls your real Behance covers, and publishes the site.

It runs again on every push and once a month, so thumbnails stay current when clients
update their sites. Anything that shows an error page (404, "access denied", bot check)
is skipped, never saved, and listed in `assets/projects/report.json`.

Prefer to run it on your own computer? Install Node.js, then in this folder:
`npm install`, `npm run setup`, `npm run shots`.

## Edit your details (one file)
Open `js/data.js`:
- `email` → your real email (powers "Contact me" and "Get a quote").
- `whatsapp` → number with country code, digits only (e.g. `923001234567`). Leave empty to hide the button.
- `linkedin`, `dribbble`, `instagram` → add links to show them in the About section.
- `TOOLS` → the tools shown in the moving strip and toolkit.
- `PROJECTS` → add, remove or reorder projects. `feature: true` puts a project in the big "Selected work" slider.

Stats (years, brands, stores, apps) are in `index.html`, search for `data-count`.

## Project screenshots and categories
- Categories: Websites & SaaS, Mobile apps, Shopify stores, Graphic design (set in `CATEGORIES` in `js/data.js`).
- Projects with `feature: true` appear in the big "Selected work" slider and are not repeated in the grid.
- Websites: real homepage screenshot, `assets/projects/<slug>.jpg`.
- Apps: the real screenshots from the Play Store / App Store listing, arranged on phones.
- Graphic design (Amazon, posters, packaging): your real Behance project covers, each linking to the project.
- Own image for any project: put it in `assets/own/` and add `img: "assets/own/file.jpg"` to that project.

## Your photo
Used in the hero ID badge, intro and About section: `assets/img/maryam.jpg`, `maryam-badge.jpg`, `maryam-tall.jpg`, `maryam-avatar.jpg`.
Replace them with other photos using the same names if you like.
