import { getImages } from "@/services/images";
import { enqueueAnalysis } from "@/services/queue";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const imageId = body && typeof body === "object" && "imageId" in body
    ? (body as { imageId: unknown }).imageId
    : null;
  if (typeof imageId !== "string" || !/^\d+$/.test(imageId)) {
    return Response.json({ error: "A valid image ID is required." }, { status: 400 });
  }

  const image = getImages().find((item) => item.id === imageId);
  if (!image) return Response.json({ error: "Image not found." }, { status: 404 });

  try {
    const status = enqueueAnalysis(imageId);
    return Response.json({ status });
  } catch (error) {
    console.error("Failed to enqueue image analysis", error);
    return Response.json({ error: "Unable to queue analysis." }, { status: 500 });
  }
}
