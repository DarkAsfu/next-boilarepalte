import { connection } from "next/server";
import { getImages, saveImages } from "@/services/images";
import { fetchPicsumImages } from "@/services/picsum";

export async function GET() {
  await connection();
  try {
    const remoteImages = await fetchPicsumImages();
    saveImages(remoteImages);
    return Response.json({ images: getImages() });
  } catch (error) {
    console.error("Failed to load dashboard images", error);
    return Response.json({ error: "Unable to load images right now." }, { status: 502 });
  }
}
