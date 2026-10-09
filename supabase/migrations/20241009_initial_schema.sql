-- Dawn Database Schema
-- Creates all tables needed for the prospect research and outreach system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Prospect status enum
CREATE TYPE prospect_status AS ENUM (
  'found',
  'pending_review',
  'approved',
  'sent',
  'replied',
  'meeting',
  'won',
  'lost',
  'denied',
  'snoozed'
);

-- Funding stage enum
CREATE TYPE funding_stage AS ENUM (
  'pre_seed',
  'seed',
  'series_a',
  'series_b',
  'other'
);

-- Email status enum
CREATE TYPE email_status AS ENUM (
  'draft',
  'approved',
  'scheduled',
  'sent',
  'failed',
  'replied'
);

-- Prospects table - core data about startups and founders
CREATE TABLE prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Status and workflow
  status prospect_status NOT NULL DEFAULT 'found',
  snoozed_until TIMESTAMPTZ,
  denied_reason TEXT,
  lost_reason TEXT,

  -- Company information
  company_name TEXT NOT NULL,
  company_description TEXT,
  company_website TEXT,
  company_logo_url TEXT,
  industry TEXT,

  -- Founder information
  founder_name TEXT NOT NULL,
  founder_title TEXT,
  founder_photo_url TEXT,
  founder_linkedin TEXT,
  founder_twitter TEXT,
  founder_email TEXT,

  -- Funding information
  funding_stage funding_stage NOT NULL,
  funding_amount DECIMAL(12, 2),
  funding_date DATE NOT NULL,
  funding_lead_investor TEXT,
  funding_source_url TEXT,

  -- Fit assessment
  fit_score INTEGER CHECK (fit_score >= 1 AND fit_score <= 10),
  fit_reasoning JSONB, -- Array of {reason: string, source_url: string}

  -- Additional links
  links JSONB, -- {linkedin, twitter, website, etc.}

  -- Tracking
  last_touched_at TIMESTAMPTZ,
  next_step TEXT,

  -- Indexes for common queries
  CONSTRAINT valid_fit_score CHECK (fit_score IS NULL OR (fit_score >= 1 AND fit_score <= 10))
);

-- Emails table - drafts, sent emails, and replies
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,

  -- Email content
  subject TEXT NOT NULL,
  body TEXT NOT NULL,

  -- Email metadata
  status email_status NOT NULL DEFAULT 'draft',
  is_follow_up BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_number INTEGER,
  parent_email_id UUID REFERENCES emails(id),

  -- Scheduling and sending
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,

  -- Reply tracking
  reply_received_at TIMESTAMPTZ,
  reply_body TEXT,

  -- Case study referenced (if any)
  case_study_id UUID, -- TODO: Add case_studies table later

  -- Edit history for voice learning
  original_subject TEXT,
  original_body TEXT,
  edit_notes TEXT
);

-- Settings table - user preferences and configuration
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- Will connect to auth.users later
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Sending window
  send_window_start TIME NOT NULL DEFAULT '09:00:00',
  send_window_end TIME NOT NULL DEFAULT '11:00:00',
  send_timezone TEXT NOT NULL DEFAULT 'America/New_York',

  -- Follow-up settings
  follow_up_delay_days INTEGER NOT NULL DEFAULT 4,
  max_follow_ups INTEGER NOT NULL DEFAULT 3,

  -- Research settings
  scan_frequency TEXT NOT NULL DEFAULT 'daily', -- daily, weekly, etc.
  scan_time TIME NOT NULL DEFAULT '00:00:00',

  -- Outreach preferences
  email_signature TEXT,

  UNIQUE(user_id)
);

-- Activities table - for the activity feed
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,

  -- Activity details
  activity_type TEXT NOT NULL, -- 'status_changed', 'email_sent', 'reply_received', etc.
  description TEXT NOT NULL,
  metadata JSONB
);

-- Tasks table - "tonight's tasks" queue
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Task details
  instruction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, failed
  result TEXT,
  error_message TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_funding_date ON prospects(funding_date DESC);
CREATE INDEX idx_prospects_fit_score ON prospects(fit_score DESC);
CREATE INDEX idx_prospects_next_step ON prospects(next_step) WHERE next_step IS NOT NULL;

CREATE INDEX idx_emails_prospect_id ON emails(prospect_id);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_scheduled_for ON emails(scheduled_for) WHERE scheduled_for IS NOT NULL;

CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_prospect_id ON activities(prospect_id);

CREATE INDEX idx_tasks_status ON tasks(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_prospects_updated_at BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create activity trigger for prospect status changes
CREATE OR REPLACE FUNCTION log_prospect_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    INSERT INTO activities (prospect_id, activity_type, description, metadata)
    VALUES (
      NEW.id,
      'status_changed',
      NEW.company_name || ' moved to ' || NEW.status,
      jsonb_build_object('from', OLD.status, 'to', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prospect_status_change_trigger AFTER UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION log_prospect_status_change();

-- Row Level Security (RLS) - Enable later when auth is set up
-- For now, we'll leave RLS disabled for development

-- Comments for documentation
COMMENT ON TABLE prospects IS 'Stores information about startup prospects including company, founder, and funding details';
COMMENT ON TABLE emails IS 'Email drafts, sent emails, and replies for prospect outreach';
COMMENT ON TABLE settings IS 'User preferences and configuration for the Dawn application';
COMMENT ON TABLE activities IS 'Activity feed entries for tracking prospect interactions';
COMMENT ON TABLE tasks IS 'Queue of overnight research and processing tasks';
