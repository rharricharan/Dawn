# Dawn — build prompts for Claude Code (shadcn/ui version)

Use these in order, one step at a time. Don't move on until the current step looks right. Give specific feedback ("the fit score is too small next to the company name", "actions should stick to the bottom of the card on mobile") rather than "make it better."

---

## 0. Setup (once)
```
Read CLAUDE.md and docs/SPEC.md. Set up the project: Next.js (App Router) with TypeScript and Tailwind, ESLint and Prettier, then initialize shadcn/ui with the neutral base color and light/dark mode (next-themes). Create the folder structure: src/app, src/components/ui (shadcn), src/components/dawn (product components), src/lib, src/mocks. Initialize git and commit. Don't build any screens yet. Summarize the structure when done.
```

## 1. Theme tokens
```
Set up the theme so a custom design system can replace it later. In globals.css, keep shadcn's theme variables and add semantic tokens for every prospect status in SPEC §3 (pending, approved, sent, replied, meeting, won, lost, denied, snoozed) plus success and warning, for light and dark mode, and expose them in the Tailwind config. Use Inter (or Geist) as the font via a CSS variable. Then build a /styleguide page that shows all color tokens, type scale, radius and spacing, in both light and dark mode, with a theme toggle.
```

## 2. Primitives
```
Add the shadcn components we'll need with the CLI: button, card, badge, tabs, dialog, sheet, dropdown-menu, popover, calendar, table, input, textarea, select, sonner, skeleton, tooltip, sidebar, avatar, separator, scroll-area, toggle-group, chart, command, label, switch, form. Add a section to /styleguide showing each one. Don't customize them yet.
```

## 3. Product components
```
Build these components in src/components/dawn using shadcn primitives and theme tokens only:
- StatusPill (all statuses in SPEC §3)
- KpiTile (label, value, optional delta and sub-label)
- FitScore (1–10, visual meter + number)
- ReasonChips (selectable chips for deny/lost reasons, with "Other" text input)
- DateRangePicker (presets from SPEC §2 + custom range using Calendar in a Popover)
- ProspectCard with compact and expanded variants (fields in SPEC §4.2)
- PipelineCard (fields in SPEC §4.3)
Create realistic mock data in src/mocks (20 prospects across all statuses, dates relative to today). Add every component and variant to /styleguide, including loading (Skeleton) and empty states. Screenshot /styleguide in light and dark mode and fix any issues.
```

## 4. App shell
```
Build the app shell using the shadcn Sidebar: nav items Dashboard, Review (with pending-count badge), Pipeline, Prospects, Analytics, then a separator and Settings, with lucide icons. Top bar: page title, DateRangePicker, search (Command palette on Cmd+K), theme toggle, avatar menu. Implement the date-range behavior in SPEC §2: persists across pages via the `range` URL param, hidden on Review and Settings, page header shows "Showing: {range}". Sidebar collapses to icons on desktop and becomes a Sheet on mobile. Pages can be placeholders for now.
```

## 5. Review screen (most important)
```
Build the Review screen per SPEC §4.2 using ProspectCard, with mock data and local state only. Desktop: pending list on the left (filters All / New / Follow-ups / Snoozed), expanded card on the right. Mobile: one card at a time with "3 of 8" progress and actions pinned to the bottom. Implement every action: Approve with Sonner toast + 5s Undo, inline Edit with Save & approve (store before/after in local state), Regenerate with an instruction input and loading state, Snooze via DropdownMenu, Deny with ReasonChips in a Dialog. Add keyboard shortcuts (A, E, R, S, D, J/K) with a "?" shortcut help dialog. Include end state and empty state. Propose your plan first. After building, screenshot desktop and mobile in light and dark mode and fix issues.
```

## 6. Dashboard
```
Build the Dashboard per SPEC §4.1 with mock data, responding to the global date range. Layout: greeting + morning report with Start review button; KPI row of KpiTiles; two Cards side by side (Needs attention, Coming up); pipeline snapshot as a small shadcn bar chart; recent activity feed in a ScrollArea; Tonight's tasks card with an input and list of queued tasks. Include Skeleton loading and empty states. Verify desktop and mobile.
```

## 7. Pipeline + Prospect Detail
```
Build Pipeline per SPEC §4.3: a ToggleGroup to switch Board / Table. Board uses @dnd-kit with columns Approved, Sent, Replied, Meeting, Won, Lost (with counts); moving to Lost opens a Dialog with ReasonChips. Table uses shadcn Table with sortable columns. Add filters (stage, industry, fit score, funding stage) in a Popover. Clicking a card or row opens Prospect Detail in a Sheet from the right. Build Prospect Detail per SPEC §4.5 as one component used both in the Sheet and as a full page at /prospects/[id], with Tabs (Overview, Research, Emails, Activity, Notes). Mock data only. Verify desktop and mobile.
```

## 8. Prospects, Analytics, Settings
```
Build Prospects (SPEC §4.4) as a searchable, filterable Table. Build Analytics (SPEC §4.6) with Tabs; only Overview is functional: funnel with conversion % between steps and a line chart of sends and replies over the selected range using shadcn Chart; other tabs show a "Coming soon" empty state. Build Settings (SPEC §4.7) with a left sub-nav and one form per section using shadcn Form with validation; save to local state for now. Verify each screen.
```

## 9. Database + auth
```
Connect Supabase. Create the tables in SPEC §5 as migrations, add Row Level Security so each user only sees their own data, add email login with Supabase Auth (build login with shadcn components), and seed the database with the mock data. Replace mock data across all screens with real queries, keeping loading, empty and error states. Propose the plan first.
```

## 10. Agent pipeline
```
Build the agent pipeline in SPEC §6, step by step. Start with Discover + Filter only, runnable manually via a script and an admin button, writing results to `prospects` with status `found`. Use the Claude API (Haiku) with my key from .env.local. Show me sample results before continuing.
```
Then:
```
Add Research & score and Draft (Sonnet), using settings for ICP, voice guide, example emails and the latest 15 edits. Set status to pending_review. Show me 5 sample cards before continuing.
```
Then:
```
Add email enrichment, the nightly cron (Vercel), the task queue for Tonight's tasks, the 30-per-night cap, failure logging to Dashboard, and the morning digest email.
```

## 11. Sending + replies
```
Connect Gmail with the send-only scope. Build the sender job (send window, daily limit, spacing, signature + mailing address + unsubscribe line), the reply detection job with Haiku labels, and the follow-up job, per SPEC §6 and §3. Add a test proving no email can be sent unless status is approved. Use a test inbox first and show me the results before enabling real sending.
```

---

## Later: swapping in your own design system
When your design system is ready (in Figma or as tokens):
```
Replace the theme with my design system: [FIGMA LINK or token file]. Map my color, type, radius, spacing and shadow tokens onto the existing CSS variables in globals.css (including the status tokens). Then restyle the shadcn primitives in src/components/ui to match my components and variants. Don't change product components or pages unless a layout must change. Show /styleguide before and after.
```
Because every component reads from tokens and primitives, this should be mostly a theme + `ui/` change, not a rewrite.

---

## Fix-it prompts (use anytime)
- `Screenshot this page at desktop and mobile in light and dark mode, list every layout, spacing, hierarchy or state issue you see, then fix them.`
- `Check this screen for hard-coded colors or arbitrary values and replace them with theme tokens.`
- `Walk me through what you changed and why before committing.`
- `Undo the last change` / `Revert to the last commit.`
- `Something's broken: [paste error]. Find the cause, explain it, then fix it.`
- `Review this screen for accessibility and keyboard support before we move on.`
