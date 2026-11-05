import { connection } from "next/server";
import ImageDashboard from "@/components/image-dashboard";
import { getImages, saveImages } from "@/services/images";
import { fetchPicsumImages } from "@/services/picsum";

export const instant = false;

export default async function Home() {
  await connection();
  try {
    const images = await fetchPicsumImages();
    saveImages(images);
  } catch (error) {
    console.error("Failed to load dashboard images", error);
  }
  return <ImageDashboard initialImages={getImages()} />;
}
