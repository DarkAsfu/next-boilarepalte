"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardImage, AnalysisStatus } from "@/types/dashboard";

function statusLabel(status: AnalysisStatus) {
  return status === "processing" ? "Analyzing" : status[0].toUpperCase() + status.slice(1);
}

export default function ImageDashboard({ initialImages }: { initialImages: DashboardImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const queueRunning = useRef(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/images", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { images: DashboardImage[] };
    setImages(data.images);
  }, []);

  const processQueue = useCallback(async (imageId?: string) => {
    await fetch("/api/queue", {
      method: "POST",
      headers: imageId ? { "content-type": "application/json" } : undefined,
      body: imageId ? JSON.stringify({ imageId }) : undefined,
    });
    await refresh();
  }, [refresh]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (queueRunning.current) return;
      queueRunning.current = true;
      void processQueue().finally(() => {
        queueRunning.current = false;
      });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [processQueue]);

  async function requestAnalysis(imageId: string) {
    setBusy((current) => ({ ...current, [imageId]: true }));
    try {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      if (!response.ok) throw new Error("Unable to queue analysis");
      void processQueue(imageId);
      await refresh();
    } finally {
      setBusy((current) => ({ ...current, [imageId]: false }));
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <header className="mb-10 flex flex-col gap-5 border-b border-zinc-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Visual intelligence</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">Image analysis lab</h1>
          <p className="mt-3 max-w-xl text-zinc-500">Explore a fresh set of photographs. Select any image to generate a caption and discover its visual story.</p>
        </div>
        <div className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">{images.length} photographs</div>
      </header>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Image gallery">
        {images.map((image) => {
          const analysis = image.analysis;
          const isBusy = busy[image.id] || analysis?.status === "processing";
          return (
            <article key={image.id} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <button type="button" className="relative block aspect-[4/3] w-full overflow-hidden bg-zinc-100 text-left" onClick={() => void requestAnalysis(image.id)} disabled={isBusy} aria-label={`Analyze photo by ${image.author}`}>
                <Image src={image.downloadUrl} alt={`Photo by ${image.author}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 backdrop-blur">{isBusy ? "Working..." : analysis?.status === "completed" ? "Analyzed" : "Click to analyze"}</span>
              </button>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-zinc-900">{image.author}</p>
                  {analysis && <span className="text-xs text-zinc-400">{statusLabel(analysis.status)}</span>}
                </div>
                {analysis?.caption && <p className="mt-3 text-sm leading-6 text-zinc-600">{analysis.caption}</p>}
                {analysis?.tags.length ? <div className="mt-3 flex flex-wrap gap-1.5">{analysis.tags.map((tag) => <span key={tag} className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">#{tag}</span>)}</div> : null}
                {analysis?.status === "failed" && <p className="mt-3 text-xs text-red-600">{analysis.error ?? "Analysis failed. Click to retry."}</p>}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
