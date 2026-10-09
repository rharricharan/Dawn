# Dawn Database Schema

## Overview
This directory contains the database schema and migrations for the Dawn application.

## Tables

### `prospects`
Stores information about startup prospects that have been discovered and researched.

**Key fields:**
- Company info: name, description, website, logo, industry
- Founder info: name, title, photo, contact details
- Funding info: stage, amount, date, lead investor
- Fit assessment: score (1-10), reasoning with sources
- Status: workflow state (found → pending_review → approved → sent → replied → meeting → won/lost)

**Status flow:**
```
found → pending_review → approved → sent → replied → meeting → won
                       ↘ denied              ↘ lost
                       ↘ snoozed → pending_review
```

### `emails`
Email drafts, sent emails, and replies for prospect outreach.

**Features:**
- Draft creation and editing
- Scheduled sending
- Follow-up tracking (with parent email reference)
- Reply detection
- Edit history for voice learning

### `settings`
User preferences and configuration.

**Includes:**
- Sending window (time range for sending emails)
- Follow-up rules (delay days, max follow-ups)
- Research settings (scan frequency, scan time)
- Email signature

### `activities`
Activity feed for tracking all prospect interactions.

**Auto-populated by triggers:**
- Prospect status changes
- Emails sent
- Replies received
- Manual updates

### `tasks`
Queue for overnight research and processing instructions.

**Example tasks:**
- "Find pre-seed companies in fintech"
- "Prioritize companies with female founders"
- "Skip companies with 'hiring' in job posts"

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for now)
1. Go to your Supabase project: https://supabase.com/dashboard/project/udswkwlzmkxfmbcnsbpb
2. Click **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy the contents of `migrations/20241009_initial_schema.sql`
5. Paste and click **Run**

### Option 2: Supabase CLI (Future)
```bash
npx supabase db push
```

## Indexes

Optimized for common queries:
- Prospects by status, funding date, fit score
- Emails by prospect, status, scheduled time
- Activities by creation date
- Tasks by status

## Triggers

- **updated_at**: Auto-updates on all tables
- **Activity logging**: Creates activity entries for prospect status changes

## Next Steps

1. ✅ Run initial schema migration
2. ⏳ Set up Row Level Security (RLS) when auth is implemented
3. ⏳ Add seed data for development/testing
4. ⏳ Create database types for TypeScript
