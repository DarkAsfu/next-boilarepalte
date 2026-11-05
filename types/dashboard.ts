export type AnalysisStatus = "queued" | "processing" | "completed" | "failed";

export type PicsumImage = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  downloadUrl: string;
};

export type ImageAnalysis = {
  status: AnalysisStatus;
  caption: string | null;
  tags: string[];
  error: string | null;
};

export type DashboardImage = PicsumImage & {
  analysis: ImageAnalysis | null;
};
