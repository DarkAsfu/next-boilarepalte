import { withDatabase } from "@/lib/db";
import type { AnalysisStatus } from "@/types/dashboard";

const leaseDurationMs = 2 * 60 * 1000;

export function enqueueAnalysis(imageId: string) {
  return withDatabase((db) => {
    const existing = db
      .prepare("SELECT status FROM analyses WHERE image_id = ?")
      .get(imageId) as { status: AnalysisStatus } | undefined;

    if (existing?.status === "completed" || existing?.status === "processing") {
      return existing.status;
    }

    db.prepare(`
      INSERT INTO analyses (image_id, status, caption, tags, error, attempts, lease_until, updated_at)
      VALUES (?, 'queued', NULL, '[]', NULL, 0, NULL, CURRENT_TIMESTAMP)
      ON CONFLICT(image_id) DO UPDATE SET
        status = 'queued',
        caption = NULL,
        tags = '[]',
        error = NULL,
        attempts = 0,
        lease_until = NULL,
        updated_at = CURRENT_TIMESTAMP
    `).run(imageId);
    return "queued" as const;
  });
}

export function claimNextJob(imageId?: string) {
  return withDatabase((db) => {
    const claim = db.transaction(() => {
      const job = imageId
        ? (db
            .prepare(`
              SELECT image_id AS imageId, attempts
              FROM analyses
              WHERE image_id = ?
                AND (status = 'queued'
                  OR (status = 'processing' AND lease_until < CURRENT_TIMESTAMP))
              LIMIT 1
            `)
            .get(imageId) as { imageId: string; attempts: number } | undefined)
        : (db
            .prepare(`
              SELECT image_id AS imageId, attempts
              FROM analyses
              WHERE status = 'queued'
                 OR (status = 'processing' AND lease_until < CURRENT_TIMESTAMP)
              ORDER BY updated_at ASC, rowid ASC
              LIMIT 1
            `)
            .get() as { imageId: string; attempts: number } | undefined);
      if (!job) return undefined;

      const leaseUntil = new Date(Date.now() + leaseDurationMs).toISOString();
      db.prepare(`
        UPDATE analyses
        SET status = 'processing',
            attempts = attempts + 1,
            lease_until = ?,
            error = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE image_id = ?
      `).run(leaseUntil, job.imageId);
      return { ...job, attempts: job.attempts + 1 };
    });
    return claim();
  });
}

export function completeAnalysis(imageId: string, caption: string, tags: string[]) {
  withDatabase((db) => {
    db.prepare(`
      UPDATE analyses
      SET status = 'completed', caption = ?, tags = ?, error = NULL,
          lease_until = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE image_id = ?
    `).run(caption, JSON.stringify(tags), imageId);
  });
}

export function failAnalysis(imageId: string, error: string, retry: boolean) {
  withDatabase((db) => {
    db.prepare(`
      UPDATE analyses
      SET status = ?, error = ?, lease_until = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE image_id = ?
    `).run(retry ? "queued" : "failed", error, imageId);
  });
}

export function getAnalysisStatus(imageId: string) {
  return withDatabase((db) => db
    .prepare("SELECT status FROM analyses WHERE image_id = ?")
    .get(imageId) as { status: AnalysisStatus } | undefined);
}
