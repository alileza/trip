# trip.alileza.me — Indonesia Trip with Ali

A small Next.js app: guests answer a short quiz and get a tailored Jan–Feb
Indonesia trip drawn on a map (Java → Bali → Nusa Tenggara). Fully client-side,
statically exported, hosted on GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

Content lives in `src/data/` (`places.ts`, `trips.ts`, `quiz.ts`); the ranking
logic is in `src/lib/recommend.ts`; the map is a dependency-free SVG in
`src/components/IndonesiaMap.tsx`.

## Build the static site

```bash
npm run build      # emits ./out (configured via output: "export")
```

## Deploy to GitHub Pages

Deployment is automatic via `.github/workflows/deploy.yml` — every push to
`main` builds and publishes.

One-time setup in the GitHub repo:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Push to `main`. The workflow builds and deploys `./out`.
3. **Custom domain:** the build ships a `CNAME` file (`public/CNAME`) with
   `trip.alileza.me`. At the DNS for `alileza.me`, add:

   ```
   CNAME   trip   alileza.github.io.
   ```

   Then in **Settings → Pages**, confirm the custom domain is `trip.alileza.me`
   and enable **Enforce HTTPS** once the certificate is issued.
