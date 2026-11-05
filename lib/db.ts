import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), ".data");
const databasePath = path.join(dataDirectory, "image-analysis.db");

let database: Database.Database | undefined;

function getDatabase() {
  if (!database) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        author TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        url TEXT NOT NULL,
        download_url TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS analyses (
        image_id TEXT PRIMARY KEY REFERENCES images(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'queued',
        caption TEXT,
        tags TEXT NOT NULL DEFAULT '[]',
        error TEXT,
        attempts INTEGER NOT NULL DEFAULT 0,
        lease_until TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS analyses_queue_idx
        ON analyses(status, lease_until, updated_at);
    `);
  }
  return database;
}

export function withDatabase<T>(callback: (db: Database.Database) => T): T {
  return callback(getDatabase());
}
