CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  owner TEXT NOT NULL,
  label TEXT NOT NULL,
  state_json TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_templates_owner ON templates(owner);
