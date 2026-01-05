// /app/lms/view/[detailId]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLmsDetailByIdQuery } from "@/services/lms-detail.service";
import {
  ArrowLeft,
  FileVideo2,
  FileAudio2,
  FileText,
  Image as ImageIcon,
  Link2,
  PlayCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LmsDetail } from "@/types/lms-detail";

/* --- Helpers --- */

// Helper untuk mendeteksi ID YouTube dari URL
function getYoutubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0`;
  }
  return null;
}

const TypeIcon: Record<LmsDetail["type"], React.ReactNode> = {
  video: <FileVideo2 className="h-5 w-5" />,
  audio: <FileAudio2 className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  image: <ImageIcon className="h-5 w-5" />,
  external_link: <Link2 className="h-5 w-5" />,
};

export default function LmsViewerPage() {
  const params = useParams<{ detailId: string }>();
  const router = useRouter();
  const detailId = Number(params.detailId);

  const { data, isFetching, isError } = useGetLmsDetailByIdQuery(detailId, {
    skip: !detailId,
  });

  const activeType = data?.type;
  // Prioritas: File Upload > Original URL (media) > Link manual
  const activeFile = data?.file ?? data?.media?.[0]?.original_url ?? null;
  const activeLink = data?.link ?? null;

  // Ukuran viewer konsisten
  const VIEW_H = "h-[60vh] md:h-[75vh]";

  // --- Renderers --- //

  const renderVideo = () => {
    // 1. Cek apakah ada file upload (mp4/webm)
    if (activeFile) {
      return (
        <video
          className={`w-full rounded-lg bg-black ${VIEW_H}`}
          src={activeFile}
          controls
          controlsList="nodownload"
        />
      );
    }

    // 2. Jika tidak ada file, cek link
    if (activeLink) {
      const ytUrl = getYoutubeEmbedUrl(activeLink);
      // 2a. Jika link adalah YouTube
      if (ytUrl) {
        return (
          <iframe
            className={`w-full rounded-lg bg-black ${VIEW_H}`}
            src={ytUrl}
            title={data?.title ?? "Video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // 2b. Jika link video biasa (bukan YouTube)
      return (
        <video
          className={`w-full rounded-lg bg-black ${VIEW_H}`}
          src={activeLink}
          controls
          controlsList="nodownload"
        />
      );
    }

    return <div className="p-4 text-zinc-500">Video source not found.</div>;
  };

  const renderPdf = () => {
    const src = activeFile ?? activeLink;
    if (!src)
      return <div className="p-4 text-zinc-500">PDF source not found.</div>;

    return (
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
        className={`w-full rounded-lg bg-white ${VIEW_H}`}
        title="PDF Viewer"
      />
    );
  };

  const renderImage = () => {
    const src = activeFile ?? activeLink;
    if (!src)
      return <div className="p-4 text-zinc-500">Image source not found.</div>;

    return (
      <div
        className={`flex w-full items-center justify-center bg-zinc-50 overflow-hidden rounded-lg border border-zinc-200 ${VIEW_H}`}
      >
        <img
          src={src}
          alt={data?.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  };

  const renderAudio = () => {
    const src = activeFile ?? activeLink;
    if (!src)
      return <div className="p-4 text-zinc-500">Audio source not found.</div>;

    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-sky-100 bg-sky-50/50 p-10 py-20">
        <div className="rounded-full bg-sky-100 p-4 text-sky-600">
          <FileAudio2 className="h-10 w-10" />
        </div>
        <audio
          className="w-full max-w-md"
          src={src}
          controls
          controlsList="nodownload"
        />
      </div>
    );
  };

  const renderExternalLink = () => {
    if (!activeLink)
      return <div className="p-4 text-zinc-500">Link URL not found.</div>;

    // Opsional: Jika tipe external_link TAPI isinya youtube, kita bisa tampilkan preview juga
    const ytUrl = getYoutubeEmbedUrl(activeLink);

    return (
      <div className="space-y-4">
        {ytUrl && (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-black">
            <iframe
              className="aspect-video w-full"
              src={ytUrl}
              title="Link Preview"
              allowFullScreen
            />
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-sky-200 bg-sky-50/50 p-8 text-center">
          <Link2 className="h-10 w-10 text-sky-400" />
          <div className="space-y-1">
            <h3 className="font-medium text-sky-900">
              Materi Tautan Eksternal
            </h3>
            <p className="text-sm text-sky-700">
              Materi ini berada di luar platform. Klik tombol di bawah untuk
              membuka.
            </p>
          </div>
          <Button asChild className="rounded-full bg-sky-600 hover:bg-sky-700">
            <a href={activeLink} target="_blank" rel="noreferrer noopener">
              Buka Tautan <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <div className="mt-2 text-xs text-sky-600/60 font-mono bg-sky-100/50 px-2 py-1 rounded max-w-md truncate">
            {activeLink}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.06),transparent_40%)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* --- Header Navigation --- */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="hidden sm:grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-200">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-zinc-800 md:text-2xl">
                {isFetching ? (
                  <span className="flex items-center gap-2 text-zinc-400">
                    <Loader2 className="h-5 w-5 animate-spin" /> Memuat
                    materi...
                  </span>
                ) : (
                  data?.title ?? `Materi #${detailId}`
                )}
              </h1>

              {!isFetching && data && (
                <div className="flex flex-wrap items-center gap-3">
                  {data.sub_title && (
                    <span className="text-sm font-medium text-sky-600">
                      {data.sub_title}
                    </span>
                  )}
                  {activeType && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                      {TypeIcon[activeType]}
                      <span className="capitalize">
                        {activeType.replace("_", " ")}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            className="shrink-0 gap-2 rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 hover:text-zinc-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        </div>

        {/* --- Main Content --- */}
        <div className="grid gap-6 lg:grid-cols-1">
          {/* Viewer Card */}
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white p-1.5 shadow-sm md:p-2">
            {isFetching ? (
              <div
                className={`flex items-center justify-center rounded-xl bg-zinc-50 ${VIEW_H}`}
              >
                <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
              </div>
            ) : isError || !data ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-red-200 bg-red-50 text-red-600">
                <AlertCircle className="h-8 w-8" />
                <p className="font-medium">
                  Materi tidak ditemukan atau terjadi kesalahan.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-xl overflow-hidden">
                {/* Logic Rendering Berdasarkan Type */}
                {activeType === "video" && renderVideo()}
                {activeType === "audio" && renderAudio()}
                {activeType === "pdf" && renderPdf()}
                {activeType === "image" && renderImage()}
                {activeType === "external_link" && (
                  <div className="bg-white p-4 h-full flex flex-col justify-center">
                    {renderExternalLink()}
                  </div>
                )}

                {!activeType && (
                  <div className="flex h-64 items-center justify-center bg-zinc-50 text-zinc-500">
                    Tipe materi tidak didukung.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description Card */}
          {!isFetching && data?.description && (
            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-zinc-800">
                Deskripsi
              </h3>
              <div
                className="prose prose-sm max-w-none text-zinc-600 prose-headings:text-zinc-800 prose-a:text-sky-600 prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}