# Dawn — project instructions for Claude Code

Read this file and `docs/SPEC.md` at the start of every session.

## What Dawn is
A web app that finds recently VC-funded pre-seed/seed startups that likely need product design help, researches and scores each one with written reasoning, drafts a personalized outreach email in the user's voice, and puts every draft in a review queue. **Nothing is ever sent without the user approving it.**

The user is a product designer. For v1 there is no Figma file: the UI is built with **shadcn/ui** and the screen specs in `docs/SPEC.md`. A custom design system will replace the default look later, so the code must make that swap easy.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui (Radix primitives) + lucide-react icons
- Recharts via shadcn's Chart component for analytics
- @dnd-kit for drag and drop on the Pipeline board
- Supabase (Postgres + Auth)
- Vercel (hosting + cron)
- Claude API: Haiku for extraction/filtering/classification, Sonnet for scoring and drafting
- Gmail API for sending (send scope only; drafts live in Dawn's own database)

## UI rules (built for a later design-system swap)
1. **Use shadcn/ui components** for everything they cover (Button, Card, Badge, Tabs, Dialog, Sheet, DropdownMenu, Popover, Calendar, Table, Input, Textarea, Select, Toast/Sonner, Skeleton, Tooltip, Sidebar, Chart). Add them with the shadcn CLI. Don't write custom versions of things shadcn already provides.
2. **All visual values come from theme tokens.** Colors, radius and fonts live only as CSS variables in `globals.css` (shadcn's theme variables) and the Tailwind config. Never hard-code hex colors, arbitrary pixel values or one-off font sizes in components. Use semantic tokens (`bg-primary`, `text-muted-foreground`, `border`), not raw palette classes like `bg-blue-500`.
3. **Status colors are tokens too.** Add semantic variables for prospect statuses (`--status-pending`, `--status-approved`, `--status-sent`, `--status-replied`, `--status-meeting`, `--status-won`, `--status-lost`, `--status-denied`) and success/warning tokens, defined for light and dark mode.
4. **Two component layers:**
   - `src/components/ui/` = shadcn primitives. Only edit these to change variants or styling globally.
   - `src/components/dawn/` = product components (ProspectCard, PipelineCard, KpiTile, StatusPill, DateRangePicker, etc.) composed from the primitives.
   Pages only use `dawn/` and `ui/` components; no page-level styling beyond layout (flex/grid/gap/padding using the spacing scale).
5. **Keep the default shadcn look for now** (neutral base color, light + dark mode). Polish layout, hierarchy and states, not branding.
6. **Verify visually.** After building a screen, run the dev server, screenshot desktop (1440px) and mobile (390px), check against the spec in `docs/SPEC.md`, and fix issues before reporting done.
7. **Every screen needs** loading (Skeleton), empty, and error states, and must be responsive. Review must work well on mobile.
8. **Accessibility:** semantic HTML, full keyboard support, visible focus states, WCAG AA contrast in light and dark mode, labels on all controls.

## Product rules
1. **Never auto-send email.** Every outbound email (first touch and follow-ups) requires an explicit approve action by the user. Treat this as a hard invariant and add a test for it.
2. **One step at a time.** Do only what the current prompt asks. Before larger tasks, propose a short plan and wait for approval.
3. **Use mock data until told otherwise.** Keep it in `src/mocks/` with realistic content (real-sounding startups, founders, funding amounts, dates relative to today).
4. **Secrets** live in `.env.local` only. Never hard-code API keys; never commit `.env*` files.
5. **Commit** after each working step with a clear message.

## Naming
Use the names in `docs/SPEC.md` (statuses, screens, components) in code, database and UI copy.
