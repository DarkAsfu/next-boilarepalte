import { getImages } from "@/services/images";
import { analyzeImage } from "@/services/anthropic";
import { claimNextJob, completeAnalysis, failAnalysis } from "@/services/queue";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const imageId =
    body && typeof body === "object" && "imageId" in body
      ? (body as { imageId: unknown }).imageId
      : undefined;
  const requestedImageId = typeof imageId === "string" && /^\d+$/.test(imageId) ? imageId : undefined;
  const job = claimNextJob(requestedImageId);
  if (!job) return Response.json({ processed: false });

  const image = getImages().find((item) => item.id === job.imageId);
  if (!image) {
    failAnalysis(job.imageId, "Image no longer exists.", false);
    return Response.json({ processed: true, status: "failed" });
  }

  try {
    const result = await analyzeImage(image.downloadUrl);
    completeAnalysis(job.imageId, result.caption, result.tags);
    return Response.json({ processed: true, status: "completed" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    failAnalysis(job.imageId, message, job.attempts < 3);
    console.error(`Analysis failed for image ${job.imageId}`, error);
    return Response.json({ processed: true, status: "failed" });
  }
}