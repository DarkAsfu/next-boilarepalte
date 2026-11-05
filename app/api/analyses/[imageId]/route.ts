import { getImages } from "@/services/images";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ imageId: string }> },
) {
  const { imageId } = await params;
  const image = getImages().find((item) => item.id === imageId);
  if (!image) return Response.json({ error: "Image not found." }, { status: 404 });
  return Response.json({ analysis: image.analysis });
}
