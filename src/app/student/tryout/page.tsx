"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  // BarChart3,
  Play,
  Loader2,
  Search,
  Clock3,
  ListChecks,
  RotateCcw,
  Layers,
  ChevronRight,
  ArrowLeft,
  NotebookPen,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTestListQuery } from "@/services/tryout/test.service";
import {
  useGenerateTestMutation,
  useGetParticipantHistoryListQuery,
} from "@/services/student/tryout.service";
import type { Test } from "@/types/tryout/test";
import Swal from "sweetalert2";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const PER_PAGE = 50; // Naikkan limit agar bisa load parent & child sekaligus untuk client-side grouping

// Extend tipe Test untuk internal grouping
type ExtendedTest = Test & {
  children?: Test[];
};

function formatDurationFromSeconds(seconds?: number) {
  if (!seconds || seconds <= 0) return "-";
  const totalMin = Math.round(seconds / 60);
  if (totalMin < 60) return `${totalMin} menit`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h} jam${m ? ` ${m} menit` : ""}`;
}

export default function TryoutListPage() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [q, setQ] = useState<string>("");

  // State untuk navigasi folder internal
  const [currentParentId, setCurrentParentId] = useState<number | null>(null);

  // Fetch data (flat list)
  const { data, isFetching, isLoading } = useGetTestListQuery({
    page,
    paginate: PER_PAGE,
    search: q,
    is_active: 1,
  });

  // History ongoing & completed
  const { data: ongoing } = useGetParticipantHistoryListQuery({
    page: 1,
    paginate: 100, // Ambil cukup banyak untuk mapping
    is_ongoing: 1,
  });
  const { data: completed } = useGetParticipantHistoryListQuery({
    page: 1,
    paginate: 100, // Ambil cukup banyak untuk mapping
    is_completed: 1,
  });

  const ongoingMap = useMemo(() => {
    const out = new Map<number, number>();
    (ongoing?.data ?? []).forEach((h) => {
      if (h.test_id && h.id) out.set(h.test_id, h.id);
    });
    return out;
  }, [ongoing]);

  // Map Test ID -> Participant Test ID (History ID) untuk yang sudah selesai
  const completedMap = useMemo(() => {
    const out = new Map<number, number>();
    (completed?.data ?? []).forEach((h) => {
      // Kita ambil record terbaru jika ada duplikat, asumsi data dari API sudah sort by date desc/grade atau kita ambil yang pertama ditemukan
      if (h.test_id && h.id && !out.has(h.test_id)) {
        out.set(h.test_id, h.id);
      }
    });
    return out;
  }, [completed]);

  const [generateTest, { isLoading: starting }] = useGenerateTestMutation();

  // --- LOGIKA GROUPING PARENT-CHILD (CLIENT SIDE) ---
  const { roots, childMap } = useMemo(() => {
    const rawItems: Test[] = data?.data ?? [];
    const rootItems: ExtendedTest[] = [];
    const childrenMapping = new Map<number, Test[]>();

    // 1. Pisahkan Parent dan Child
    rawItems.forEach((item) => {
      if (item.parent_id) {
        // Ini adalah Child
        if (!childrenMapping.has(item.parent_id)) {
          childrenMapping.set(item.parent_id, []);
        }
        childrenMapping.get(item.parent_id)?.push(item);
      } else {
        // Ini adalah Parent (atau Single Test)
        rootItems.push({ ...item, children: [] });
      }
    });

    // 2. Masukkan children ke parent-nya (opsional, untuk akses mudah)
    rootItems.forEach((parent) => {
      const myChildren = childrenMapping.get(parent.id);
      if (myChildren) {
        parent.children = myChildren;
      }
    });

    return { roots: rootItems, childMap: childrenMapping };
  }, [data]);

  // Tentukan items yang akan ditampilkan berdasarkan view saat ini (Root atau Inside Folder)
  const displayedItems = useMemo(() => {
    if (currentParentId) {
      // Sedang di dalam folder -> Tampilkan children dari parent tersebut
      return childMap.get(currentParentId) ?? [];
    } else {
      // Di halaman utama -> Tampilkan hanya Parent/Root items
      return roots;
    }
  }, [currentParentId, childMap, roots]);

  // Parent info untuk header saat di dalam folder
  const currentParentInfo = useMemo(() => {
    if (!currentParentId) return null;
    return roots.find((r) => r.id === currentParentId);
  }, [currentParentId, roots]);

  const working = isLoading || isFetching;

  useEffect(() => {
    const t = setTimeout(() => {
      // Reset ke root jika search berubah, atau biarkan user mencari dalam folder?
      // Biasanya reset page saat search
      // setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  // Handle Start Single Test / Child Test
  async function handleStart(testId: number) {
    try {
      void Swal.fire({
        title: "Mempersiapkan tryout…",
        text: "Mohon tunggu sebentar",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await generateTest({ test_id: testId }).unwrap();

      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "Sesi dibuat",
        text: "Mengalihkan ke halaman instruksi…",
        timer: 900,
        showConfirmButton: false,
      });

      router.push(`/student/tryout/session/${res.id}/start`);
    } catch (e) {
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Gagal memulai tryout",
        text:
          e instanceof Error
            ? e.message
            : "Terjadi kesalahan pada server. Coba lagi nanti.",
      });
    }
  }

  function handleContinue(participantTestId: number) {
    router.push(`/student/tryout/session/${participantTestId}/start`);
  }

  // Masuk ke folder parent
  function handleOpenFolder(parentId: number) {
    setCurrentParentId(parentId);
    // Optional: Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Kembali ke root list
  function handleBackToRoot() {
    setCurrentParentId(null);
  }

  return (
    <div className="space-y-8">
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-sky-500 via-sky-400 to-sky-600 p-6 text-white shadow-lg ring-1 ring-white/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          {currentParentId ? (
            // Header saat di dalam folder
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/20 -ml-2 h-8 px-2"
                onClick={handleBackToRoot}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Utama
              </Button>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl flex items-center gap-2">
                <FolderOpen className="h-8 w-8 text-white/80" />
                {currentParentInfo?.title ?? "Paket Soal"}
              </h1>
              <p className="mt-1 text-sm text-white/90">
                {currentParentInfo?.sub_title ||
                  "Daftar sub-test yang tersedia dalam paket ini."}
              </p>
            </div>
          ) : (
            // Header Utama
            <>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Tryout
              </h1>
              <p className="mt-1 text-sm text-white/90">
                Pilih paket tryout dan mulai kerjakan secara real-time.
              </p>

              <div className="mt-4 max-w-xl">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80" />
                  <Input
                    placeholder="Cari Tryout..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="rounded-xl border-0 bg-white px-9 py-2 text-slate-900 shadow-sm outline-none ring-2 ring-transparent focus:ring-sky-300"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Grid Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {working && !displayedItems.length
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
                <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-zinc-100" />
              </div>
            ))
          : displayedItems.map((t) => {
              // --- LOGIKA UTAMA ---
              // Jika ini di Root List (currentParentId == null), cek apakah dia Parent yang punya anak
              const children = (t as ExtendedTest).children || [];
              const isParentBundle = !currentParentId && children.length > 0;

              // Logic untuk Single Test (bisa Parent tanpa anak, atau Child item)
              const ongoingId = ongoingMap.get(t.id);
              const completedId = completedMap.get(t.id);

              const isContinuable = !!ongoingId;
              const isCompleted = !!completedId;

              return (
                <article
                  key={t.id}
                  className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-zinc-200/70 transition hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
                >
                  {/* Top Content */}
                  <div>
                    {/* Icon Pojok Kanan Atas */}
                    <div
                      className={`absolute right-4 top-4 rounded-xl p-2 ring-1 ${
                        isParentBundle
                          ? "bg-amber-50 text-amber-600 ring-amber-100/70"
                          : "bg-sky-50 text-sky-600 ring-sky-100/70"
                      }`}
                    >
                      {isParentBundle ? (
                        <Layers className="h-5 w-5" />
                      ) : // Jika di dalam folder (child), icon file text, jika root single test icon folder open
                      currentParentId ? (
                        <ListChecks className="h-5 w-5" />
                      ) : (
                        <FolderOpen className="h-5 w-5" />
                      )}
                    </div>

                    <div className="pr-10">
                      {isParentBundle ? (
                        <Badge
                          variant="outline"
                          className="mb-2 bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Paket Induk
                        </Badge>
                      ) : currentParentId ? (
                        <Badge
                          variant="outline"
                          className="mb-2 bg-slate-50 text-slate-700 border-slate-200"
                        >
                          Sub-Test
                        </Badge>
                      ) : null}

                      <h3 className="text-lg font-semibold text-zinc-900 line-clamp-2">
                        {t.title}
                      </h3>
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {t.sub_title ?? "-"}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-zinc-600">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200/70">
                        <Clock3 className="h-4 w-4 text-sky-600" />
                        <span>
                          Durasi:{" "}
                          <strong className="text-zinc-800">
                            {t.timer_type === "per_category"
                              ? "Per kategori"
                              : formatDurationFromSeconds(t.total_time)}
                          </strong>
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-zinc-200/70">
                        <ListChecks className="h-4 w-4 text-sky-600" />
                        <span>
                          {isParentBundle ? "Sub-Tes: " : "Soal: "}
                          <strong className="text-zinc-800">
                            {isParentBundle
                              ? children.length
                              : t.total_questions ?? 0}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-5 grid grid-cols-1 gap-2">
                    {isParentBundle ? (
                      /* --- JIKA PARENT BUNDLE (Punya Child) --- */
                      /* Klik untuk masuk ke "folder" child */
                      <Button
                        onClick={() => handleOpenFolder(t.id)}
                        className="w-full justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                      >
                        <ListChecks className="h-4 w-4" />
                        Lihat Daftar Tes
                        <ChevronRight className="h-4 w-4 opacity-70" />
                      </Button>
                    ) : (
                      /* --- JIKA SINGLE TEST / CHILD ITEM (Langsung Kerjakan) --- */
                      <div className="grid grid-cols-2 gap-2">
                        {isContinuable ? (
                          <Button
                            onClick={() => handleContinue(ongoingId!)}
                            className="justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700"
                          >
                            <RotateCcw className="h-4 w-4" />
                            Lanjutkan
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleStart(t.id)}
                            disabled={starting || isCompleted}
                            title={
                              isCompleted
                                ? "Tryout ini sudah diselesaikan"
                                : undefined
                            }
                            className="justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300"
                          >
                            {starting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Memulai...
                              </>
                            ) : isCompleted ? (
                              <>Selesai</>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                Mulai
                              </>
                            )}
                          </Button>
                        )}

                        {isCompleted ? (
                          <Button
                            variant="outline"
                            className="justify-center gap-2 border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800"
                            asChild
                          >
                            <Link href={`/student/tryout/score/${completedId}`}>
                              <NotebookPen className="h-4 w-4" />
                              Nilai
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="justify-center gap-2 opacity-50"
                            disabled
                          >
                            <Trophy className="h-4 w-4" />
                            Nilai
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}

        {!working && displayedItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center text-zinc-500">
            <div className="rounded-full bg-zinc-50 p-4 ring-1 ring-zinc-100">
              <Search className="h-8 w-8 opacity-50" />
            </div>
            <p className="mt-3 font-medium">Tidak ada tryout yang tersedia.</p>
            {currentParentId && (
              <Button
                variant="link"
                onClick={handleBackToRoot}
                className="mt-2"
              >
                Kembali ke Daftar Utama
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Pagination - Disembunyikan saat dalam folder mode child karena semua child diload upfront */}
      {!currentParentId && data && data.last_page > 1 && (
        <nav className="flex items-center justify-between rounded-2xl border bg-white p-3 shadow-sm">
          <div className="text-sm text-zinc-600">
            Total {data.total} data • Halaman {page} dari {data.last_page}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
              disabled={page === data.last_page}
            >
              Berikutnya
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}