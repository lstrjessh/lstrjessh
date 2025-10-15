# Minimal Portfolio (from Resume.pdf)

This is a minimal, single-page portfolio built from your resume. It includes:
- A simple, responsive layout (index.html + styles.css).
- Inline SVG badges in `badges/`.
- A privacy-friendly visit counter using CountAPI (no server keys required) in `scripts/analytics.js`.
- Place `Resume.pdf` next to `index.html` to enable the resume download link.

How to use
1. Add `Resume.pdf` to the repository (same directory as index.html).
2. Push to GitHub and enable GitHub Pages (or deploy to Vercel / Netlify).
3. The analytics counter will start counting visits automatically via CountAPI.

Customize
- Change the displayed name & copy in `index.html`.
- Replace the `badges/*.svg` with your preferred icons.
- To change the analytics namespace, edit `namespace` in `scripts/analytics.js`.

Notes about analytics
- CountAPI is a free, anonymous public counter service. It stores counts publicly and is suitable for simple counters. If you need private, advanced analytics (referrers, unique visitors), consider Plausible, Fathom, or a server-side solution.
- The scripts increment both a global total and a per-day key (`visits-YYYY-MM-DD`) and renders the last 7 days.

Deploy
- GitHub Pages: push to `main`/`gh-pages`, then enable Pages in repo settings.
- Vercel / Netlify: connect the repository and deploy — no server code required.

If you'd like, I can:
- Extract more specific content from your Resume.pdf (education, roles, project names) and fill the Projects / About sections.
- Add a simple projects section that reads from a JSON file.
- Replace CountAPI with a serverless function (Vercel / Netlify) that records counts to a repo file or database for absolute ownership.
