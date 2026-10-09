-- Add profiles table for user onboarding and preferences

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Basic info
  full_name TEXT,
  avatar_url TEXT,

  -- Onboarding
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,

  -- Professional info (collected during onboarding)
  job_title TEXT,
  company_name TEXT,
  website TEXT,

  -- Preferences (collected during onboarding)
  target_industries TEXT[], -- e.g., ["fintech", "healthtech"]
  target_funding_stages TEXT[], -- e.g., ["pre_seed", "seed"]
  target_regions TEXT[], -- e.g., ["US", "Europe"]

  -- Settings reference (for sending preferences etc.)
  settings_id UUID REFERENCES settings(id)
);

-- Create index for fast user lookups
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_profiles_onboarding ON profiles(onboarding_completed);

-- Add updated_at trigger
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

COMMENT ON TABLE profiles IS 'User profiles with onboarding status and preferences';
