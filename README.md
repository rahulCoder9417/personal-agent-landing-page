# Textcrew landing page

Marketing site for Textcrew, the personal AI agent you text from WhatsApp, Telegram or iMessage. It is in **private beta, launching soon**, so the page's job is to explain the product and collect beta waitlist signups.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, three.js (3D hero), motion (scroll reveals) and simple-icons (app logos).

## Run it

```bash
npm install
cp .env.example .env.local   # optional in development
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Environment

| Variable | Needed | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for metadata, sitemap and social cards. Defaults to `https://textcrew.ai`. |
| `WAITLIST_WEBHOOK_URL` | Production | Where signups are sent as a JSON `POST` (`{ email, channel, source, joinedAt }`). Zapier/Make webhooks, Loops or your own backend all work. |
| `WAITLIST_WEBHOOK_SECRET` | Optional | Sent as `Authorization: Bearer <secret>` so the receiving endpoint can reject other callers. |

Without `WAITLIST_WEBHOOK_URL`, signups are only logged to the terminal in development, and the API answers `503` in production so no signup is silently dropped.

## What's on the page

Sections, in order: a centred hero with the waitlist form and floating app logos, a product window (chat + activity feed) with the 3D Tex perched on top, how it works, integrations, use cases, automations, the crew and roadmap (what's coming next), privacy and security, features, pricing, FAQ, and a final waitlist call to action. There is also a `/privacy` summary page.

The visual language follows the products it sits next to (Notis, Multiply, Strawberry): light background, centred sections, real app logos, product mockups and pill buttons.

All copy lives in `src/lib/content.ts` and `src/lib/site.ts`, taken from the platform overview and the backend HLD (plans, credits, security, roadmap). Change wording there, not in the components.

## Project layout

```
src/
├── app/
│   ├── api/waitlist/route.ts   waitlist signup: validation, honeypot, rate limit, webhook forward
│   ├── privacy/page.tsx        plain-language privacy summary (draft until the full policy)
│   ├── layout.tsx              fonts (Geist, Geist Mono), metadata, theme colour
│   ├── page.tsx                the landing page
│   ├── globals.css             brand tokens, dot grid, floating logos, agent animations
│   ├── icon.svg, opengraph-image.tsx, robots.ts, sitemap.ts
├── components/
│   ├── agent.tsx               2D mascots (Tex and the crew) as SVG, animated with CSS
│   ├── tex-3d.tsx              3D Tex for the hero (three.js, loaded on the client only)
│   ├── product-showcase.tsx    the hero product window (chat + activity feed)
│   ├── perched-tex.tsx         3D Tex on the window edge, with "Send Tex a task"
│   ├── brand-icon.tsx          app logos from simple-icons (Slack is a neutral tile)
│   ├── waitlist-form.tsx       email + preferred chat app
│   └── …                       one file per section
└── lib/
    ├── content.ts              all section copy
    └── site.ts                 name, URL, tagline, status
```

## Notes

- **Mascots.** Tex is the captain; Scout (research), Byte (coder), Patch (code review), Echo (marketing), Pitch (sales) and Tock (ops) are shown as "coming soon". 3D is used only in the hero; everything else is 2D.
- **3D fallback.** The hero shows the 2D Tex until three.js has loaded, and keeps it if WebGL isn't available. Rendering pauses when the stage is off-screen or the tab is hidden.
- **Motion.** All animation respects `prefers-reduced-motion`.
- **Theme.** Light only, on purpose, to match the category.
- **Rate limiting.** The waitlist rate limit is in memory per server instance. Put the real limit on the receiving endpoint if abuse becomes a problem.
- **No analytics or cookies** yet, so no cookie banner is needed. Add one if you add analytics.
