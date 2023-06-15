export const createSchemaBlobs: string = `
CREATE TABLE IF NOT EXISTS blobs (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT,
  type TEXT,
  blob BLOB
);
CREATE INDEX IF NOT EXISTS blobs_index_name ON blobs (name);
PRAGMA user_version = 1;
`;
