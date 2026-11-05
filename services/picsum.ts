import type { PicsumImage } from "@/types/dashboard";

const PICSUM_URL = "https://picsum.photos/v2/list?page=1&limit=20";

type PicsumResponse = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

function isPicsumImage(value: unknown): value is PicsumResponse {
  if (!value || typeof value !== "object") return false;
  const image = value as Record<string, unknown>;
  return (
    typeof image.id === "string" &&
    typeof image.author === "string" &&
    typeof image.width === "number" &&
    typeof image.height === "number" &&
    typeof image.url === "string" &&
    typeof image.download_url === "string"
  );
}

export async function fetchPicsumImages(): Promise<PicsumImage[]> {
  "use cache";
  const response = await fetch(PICSUM_URL);
  if (!response.ok) {
    throw new Error(`Picsum request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || data.length < 20 || !data.every(isPicsumImage)) {
    throw new Error("Picsum returned an invalid image list");
  }

  return data.map((image) => ({
    id: image.id,
    author: image.author,
    width: image.width,
    height: image.height,
    url: image.url,
    downloadUrl: image.download_url,
  }));
}
