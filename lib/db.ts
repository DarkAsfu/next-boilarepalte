import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function resolveDataDirectory(): string {
  const configuredPath = process.env.DATABASE_PATH;
  if (configuredPath) return path.dirname(configuredPath);

  const localDirectory = path.join(process.cwd(), ".data");
  try {
    fs.mkdirSync(localDirectory, { recursive: true });
    fs.accessSync(localDirectory, fs.constants.W_OK);
    return localDirectory;
  } catch {
    const temporaryDirectory = path.join(os.tmpdir(), "image-analysis-data");
    fs.mkdirSync(temporaryDirectory, { recursive: true });
    return temporaryDirectory;
  }
}

function resolveDatabasePath(): string {
  if (process.env.DATABASE_PATH) return process.env.DATABASE_PATH;
  return path.join(resolveDataDirectory(), "image-analysis.db");
}

const dataDirectory = resolveDataDirectory();
const databasePath = resolveDatabasePath();

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
