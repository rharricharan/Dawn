-- Add passkey credentials table for WebAuthn authentication

CREATE TABLE passkey_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- WebAuthn credential data
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,

  -- Device/authenticator info
  device_name TEXT,
  device_type TEXT, -- e.g., 'platform' (Touch ID) or 'cross-platform' (security key)

  -- Metadata
  last_used_at TIMESTAMPTZ,

  CONSTRAINT valid_counter CHECK (counter >= 0)
);

-- Create indexes
CREATE INDEX idx_passkey_credentials_user_id ON passkey_credentials(user_id);
CREATE INDEX idx_passkey_credentials_credential_id ON passkey_credentials(credential_id);

-- Add updated_at trigger
CREATE TRIGGER update_passkey_credentials_updated_at
  BEFORE UPDATE ON passkey_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create table for storing challenges (temporary, for registration/authentication)
CREATE TABLE passkey_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Challenge data
  challenge TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, -- For registration before user is created

  -- Expiry (challenges should be short-lived)
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),

  -- Type of challenge
  type TEXT NOT NULL CHECK (type IN ('registration', 'authentication'))
);

-- Create index for fast challenge lookup
CREATE INDEX idx_passkey_challenges_challenge ON passkey_challenges(challenge);
CREATE INDEX idx_passkey_challenges_expires_at ON passkey_challenges(expires_at);

-- Auto-delete expired challenges
CREATE OR REPLACE FUNCTION delete_expired_passkey_challenges()
RETURNS void AS $$
BEGIN
  DELETE FROM passkey_challenges WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE passkey_credentials IS 'Stores WebAuthn passkey credentials for passwordless authentication';
COMMENT ON TABLE passkey_challenges IS 'Temporary storage for WebAuthn challenges during registration/authentication';
