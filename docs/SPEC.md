# Dawn — product spec (v1)

## 1. Overview
**User:** a freelance product designer looking for clients.
**Target prospects:** US software startups that raised a pre-seed or seed round in the last 3–8 weeks and likely need design help.
**Core loop:** Dawn researches overnight → user gets a morning report → reviews each prospect (approve / edit / deny) → approved emails send in the user's sending window → replies and outcomes are tracked in the pipeline.

**Principles**
- Human approval before every send.
- Pull, not push: one morning digest, no interruptive pop-ups.
- Show the reasoning: every prospect explains why it fits, with sources.

---

## 2. Navigation
Left sidebar:
```
Dashboard
Review        (badge: pending count)
Pipeline
Prospects
Analytics
───────
Settings
```
Top bar: page title · **global date-range picker** · search · avatar.

**Date-range picker**
- Options: Today, Yesterday, Last 7 days, Last 30 days, This month, Custom range.
- Shown on Dashboard, Pipeline, Prospects, Analytics. Hidden on Review and Settings.
- Global: the selection persists across pages (store in URL query param `range` + local state).
- Page header shows the active range, e.g. "Showing: Last 7 days".

---

## 3. Prospect status model
```
found → pending_review → approved → sent → replied → meeting → won
                       ↘ denied (reason)       ↘ lost (reason)
                       ↘ snoozed (until date) → pending_review
```
- `found`: discovered, not yet researched/drafted (internal only).
- `pending_review`: research + draft ready, waiting for user.
- `approved`: user approved, queued for next send window.
- `sent`: email delivered.
- `replied`: a reply was received.
- `meeting`: user marked a call booked.
- `won` / `lost`: final outcome. `lost` requires a reason.
- `denied`: user rejected in Review. Requires a reason (chip or free text).
- `snoozed`: returns to `pending_review` on the chosen date.

Automatic transitions: approve → `approved`; send succeeds → `sent`; reply detected → `replied`.
Manual transitions: drag on Pipeline board or status menu in Prospect Detail.

Follow-ups: if `sent` and no reply after N days (setting, default 4), create a follow-up draft in Review labeled "Follow-up #1". Max follow-ups: setting, default 3. Follow-ups also require approval.

---

## 4. Screens

### 4.1 Dashboard (home)
Respects global date range.
- **Header:** greeting + morning report line ("8 new finds overnight") + primary button **Start review** (→ Review). Hidden if 0 pending.
- **KPI row (tiles):** Found · Approved · Sent · Replies (count + reply rate %) · Meetings.
- **Needs attention:** replies to answer, follow-ups to review, failed tasks. Each item links to its destination.
- **Coming up:** sends scheduled today (with window), follow-ups due tomorrow, tonight's tasks count.
- **Pipeline snapshot:** count per stage as a horizontal bar or mini columns; clicking a stage opens Pipeline filtered to it.
- **Recent activity:** chronological feed ("Acme replied · 2h ago").
- **Tonight's tasks** input: text field + Add. Tasks are natural-language instructions queued for the overnight run.

### 4.2 Review
Not affected by date range. Shows prospects in `pending_review` (new finds + follow-ups).
- **Layout desktop:** left list of pending items (filters: All · New · Follow-ups · Snoozed) + right Prospect Card (expanded).
- **Layout mobile:** one card at a time, full width, progress "3 of 8".
- **Prospect Card fields:**
  - Founder: name, title, photo
  - Company: name, logo, one-line description
  - Funding: stage, amount, date, lead investor, source link
  - Fit score (1–10)
  - Why they fit: 2–4 bullet reasons with source links
  - Links: LinkedIn · Website · X · other socials · source article
  - Draft: subject, body, case study referenced; label if follow-up ("Follow-up #1 · no reply in 4 days")
- **Actions:**
  - **Approve** (primary): status → `approved`; card exits; toast "Scheduled for 9:12am" with **Undo** (5s).
  - **Edit:** inline editor for subject/body → **Save & approve** / Cancel. Save stores an edit record (before/after) for voice learning.
  - **Regenerate:** optional instruction input ("shorter", "more casual") → loading state on draft only.
  - **Snooze:** 3 days / 1 week / custom.
  - **Deny:** reason chips (Bad fit · Too early · Already has designer · Bad timing · Other + text) → status `denied`.
- **Keyboard shortcuts (desktop):** A approve, E edit, R regenerate, S snooze, D deny, ↑/↓ or J/K move between items.
- **End state:** "All caught up. 6 approved, sending 9–11am." + link to Pipeline.
- **Empty state (no finds yet):** explains the next scan time.

### 4.3 Pipeline
Respects global date range. Shows statuses `approved` → `won`/`lost` (not `pending_review`, `denied`, `snoozed`).
- **Toggle:** Board (default) / Table.
- **Board columns:** Approved · Sent · Replied · Meeting · Won · Lost, each with count.
- **Pipeline card:** logo + company, founder name, funding tag ("Seed · $3M · 5 wks ago"), fit score, last touch ("Sent 3 days ago"), next step ("Follow-up #1 due tomorrow"), unread-reply dot.
- **Drag and drop** between columns for manual moves. Moving to Lost opens reason picker (No budget · Hired in-house · No response · Bad fit · Other).
- **Click card** → right slide-over with Prospect Detail (board stays visible).
- **Filters:** stage, industry, fit score range, funding stage. Plus global date range.
- **Table columns:** Company · Founder · Status · Fit · Funding (stage/amount/date) · Last touch · Next step. Sortable.

### 4.4 Prospects
Respects global date range. Searchable list of all prospects, every status including denied.
- Table with search and filters (status, industry, score, funding stage).
- Row click → Prospect Detail page.

### 4.5 Prospect Detail
Page (from Prospects) or slide-over (from Pipeline). Same component.
- **Header:** company, founder, status pill + status menu, fit score, links.
- **Tabs:** Overview · Research · Emails · Activity · Notes
  - Overview: funding details, company info, founder info.
  - Research: AI reasoning, signals found, site audit notes, sources.
  - Emails: full thread (sent, replies, follow-ups, scheduled).
  - Activity: timeline of status changes and events.
  - Notes: user's free-text notes (autosave).

### 4.6 Analytics
Respects global date range. Tabs: **Overview** (v1) · Outreach · Targeting · Agent quality (later).
- **Overview:** funnel found → approved → sent → replied → meeting → won with conversion % per step; trend line of sends and replies over the range.
- Later tabs: reply rate by hook/subject/case study/send time (Outreach); performance by industry/stage/raise size/signal (Targeting); approval rate, edit rate, deny reasons over time (Agent quality).

### 4.7 Settings
Sections (left sub-nav):
- **Ideal client:** plain-English description; stages (pre-seed, seed); industries include/exclude; geography; raise window (weeks, default 3–8); minimum fit score to show (default 6).
- **Voice:** voice guide (textarea); example emails (add/remove); learned edits list (view/delete).
- **Case studies:** title, one-line summary, link, "use when" description. (Seed: STIM — 0-to-1 enterprise platform, launched in three U.S. cities.)
- **Sending:** connected Gmail account; daily limit (default 20); send window (default 9:00–11:00, user's timezone); weekdays only toggle; signature; physical mailing address + unsubscribe line (required, CAN-SPAM).
- **Notifications:** morning report time (default 8:30am); channels (email digest default; web push optional); reply alerts on/off; quiet hours.
- **Data sources:** toggles + API keys for each source (stored server-side).
- **Account.**

### 4.8 Morning digest email
Subject: "Your dawn report · {n} new finds". Body: counts (new finds, follow-ups ready, replies), top 3 prospects (company + one-line reason), **Start review** button → `/review`. Plain, short, mobile-friendly.

---

## 5. Data model (Supabase)
- `prospects`: id, company_name, company_domain, company_description, logo_url, founder_name, founder_title, founder_photo_url, founder_email, linkedin_url, x_url, other_links (json), funding_stage, funding_amount, funding_date, lead_investor, funding_source_url, industry, fit_score, fit_reasons (json: [{text, source_url}]), research_notes, status, status_reason, snoozed_until, created_at, updated_at.
- `drafts`: id, prospect_id, kind (initial | followup), followup_number, subject, body, case_study_id, version, created_at.
- `emails`: id, prospect_id, draft_id, direction (outbound | inbound), subject, body, gmail_message_id, thread_id, scheduled_for, sent_at, received_at, reply_label (interested | not_now | unsubscribe | ooo | other).
- `edits`: id, draft_id, before_subject, before_body, after_subject, after_body, created_at. (Used as voice examples.)
- `events`: id, prospect_id, type, payload (json), created_at. (Activity feed + analytics.)
- `tasks`: id, instruction, status (queued | running | done | failed), result_summary, error, created_at, completed_at.
- `case_studies`: id, title, summary, url, use_when.
- `settings`: single row per user: icp_description, stages, industries_include, industries_exclude, geography, raise_window_min_weeks, raise_window_max_weeks, min_fit_score, voice_guide, example_emails (json), daily_limit, send_window_start, send_window_end, weekdays_only, signature, mailing_address, report_time, timezone, notification_channels, reply_alerts, quiet_hours.

---

## 6. Agent pipeline (backend, built after UI)
Runs nightly (cron, default 2:00am user time) and processes queued `tasks`.
1. **Discover:** pull new raises (SEC Form D, YC directory, funding news search). Code + Haiku for field extraction. Dedupe by domain.
2. **Filter:** Haiku yes/no against ICP (stage, software, US, raise window, not seen).
3. **Research & score:** Sonnet visits site/public info; outputs fit_score, fit_reasons with sources, hook, chosen case study. Discard below min_fit_score.
4. **Enrich:** email finder API for founder email; collect public links. **No LinkedIn scraping**; store profile URL only.
5. **Draft:** Sonnet writes email using voice guide + example emails + latest 15 edits. Under 80 words, one specific observation, one case-study line, soft CTA.
6. **Queue:** status → `pending_review`.
7. **Report:** send morning digest at report_time.
**Sender job:** during send window, send `approved` emails spaced 3–8 min apart, respecting daily limit; append signature, mailing address, unsubscribe line.
**Reply job (every 15 min):** detect replies, label with Haiku, update status, create event.
**Follow-up job (daily):** create follow-up drafts per rules in §3.
**Guardrails:** cap 30 prospects per night; log failures to `tasks` and surface on Dashboard; never send without `approved` status.
