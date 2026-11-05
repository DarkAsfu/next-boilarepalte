import { withDatabase } from "@/lib/db";
import type { AnalysisStatus, DashboardImage, PicsumImage } from "@/types/dashboard";

export function saveImages(images: PicsumImage[]) {
  withDatabase((db) => {
    const statement = db.prepare(`
      INSERT INTO images (id, author, width, height, url, download_url)
      VALUES (@id, @author, @width, @height, @url, @downloadUrl)
      ON CONFLICT(id) DO UPDATE SET
        author = excluded.author,
        width = excluded.width,
        height = excluded.height,
        url = excluded.url,
        download_url = excluded.download_url
    `);
    const saveMany = db.transaction((items: PicsumImage[]) => {
      for (const image of items) statement.run(image);
    });
    saveMany(images);
  });
}

export function getImages(): DashboardImage[] {
  return withDatabase((db) => {
    const rows = db
      .prepare(`
        SELECT
          i.id, i.author, i.width, i.height, i.url,
          i.download_url AS downloadUrl,
          a.status, a.caption, a.tags, a.error
        FROM images i
        LEFT JOIN analyses a ON a.image_id = i.id
        ORDER BY CAST(i.id AS INTEGER)
      `)
      .all() as Array<{
      id: string;
      author: string;
      width: number;
      height: number;
      url: string;
      downloadUrl: string;
      status: AnalysisStatus;
      caption: string | null;
      tags: string;
      error: string | null;
    }>;

    return rows.map((row) => ({
      id: row.id,
      author: row.author,
      width: row.width,
      height: row.height,
      url: row.url,
      downloadUrl: row.downloadUrl,
      analysis: row.status
        ? {
            status: row.status,
            caption: row.caption,
            tags: JSON.parse(row.tags) as string[],
            error: row.error,
          }
        : null,
    }));
  });
}
