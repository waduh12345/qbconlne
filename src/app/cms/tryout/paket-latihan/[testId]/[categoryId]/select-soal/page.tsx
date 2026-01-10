"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

import { useCreateTestQuestionMutation } from "@/services/tryout/test-questions.service";
import { useGetQuestionListQuery } from "@/services/bank-questions/questions.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckSquare, Square, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import Pager from "@/components/ui/tryout-pagination";
import { Badge } from "@/components/ui/badge"; // Import Badge
import type { Questions } from "@/types/bank-questions/questions";

/** parse hanya menerima bilangan bulat positif */
const toPosInt = (seg: string | string[] | undefined): number => {
  const s = Array.isArray(seg) ? seg[0] : seg;
  if (!s || !/^\d+$/.test(s)) return 0;
  return parseInt(s, 10);
};

export default function SelectSoalPage() {
  const params = useParams<{ testId: string; categoryId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // param as string
  const testIdSeg = params?.testId;
  const catIdSeg = params?.categoryId;

  // sudah loaded jika keduanya adalah string
  const idsLoaded =
    typeof testIdSeg === "string" && typeof catIdSeg === "string";

  const testId = idsLoaded ? toPosInt(testIdSeg) : 0;
  const testQuestionCategoryId = idsLoaded ? toPosInt(catIdSeg) : 0;
  const hasValidIds = idsLoaded && testId > 0 && testQuestionCategoryId > 0;

  // kategori bank-soal (untuk filter otomatis)
  const questionCategoryId = toPosInt(searchParams.get("qcat") || undefined);
  const categoryName = searchParams.get("qcat_name") || "";

  const [page, setPage] = useState<number>(1);
  // Default 25 sesuai request
  const [paginate, setPaginate] = useState<number>(25);
  const [search, setSearch] = useState<string>("");

  // list bank soal global, auto-filter by qcat
  const { data, isLoading, refetch } = useGetQuestionListQuery({
    page,
    paginate,
    search,
    question_category_id: questionCategoryId || undefined,
  });

  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [create, { isLoading: saving }] = useCreateTestQuestionMutation();

  const list: Questions[] = useMemo(() => data?.data ?? [], [data]);
  const allIds = useMemo(() => list.map((q) => q.id), [list]);
  const allChecked = allIds.length > 0 && allIds.every((id) => selected[id]);

  // Hitung jumlah yang dipilih
  const selectedCount = Object.keys(selected).filter(
    (k) => selected[Number(k)]
  ).length;

  const toggleAll = (checked: boolean) => {
    const next: Record<number, boolean> = { ...selected }; // Spread existing selection
    // Hanya toggle yang ada di page ini
    allIds.forEach((id) => (next[id] = checked));
    setSelected(next);
  };

  const submit = async () => {
    if (!hasValidIds) {
      await Swal.fire({
        icon: "error",
        title: "Parameter tidak valid",
        text: "Halaman belum memuat ID test/kategori dengan benar.",
      });
      return;
    }

    const question_ids = Object.keys(selected)
      .filter((k) => selected[Number(k)])
      .map((x) => Number(x));

    if (!question_ids.length) {
      await Swal.fire({ icon: "info", title: "Pilih soal dulu" });
      return;
    }

    try {
      await create({
        test_id: testId,
        test_question_category_id: testQuestionCategoryId,
        payload: { question_ids },
      }).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Soal ditambahkan ke paket.",
      });
      setSelected({});
      refetch();
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Gagal", text: String(e) });
    }
  };

  return (
    <>
      <SiteHeader title="Pilih Soal" />
      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <h1 className="text-xl font-semibold">Bank Soal</h1>
            </div>
            <div className="ml-1 text-sm text-muted-foreground flex items-center gap-2">
              <span>Kategori:</span>
              <span className="font-medium text-foreground">
                {categoryName ||
                  (questionCategoryId ? `#${questionCategoryId}` : "-")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indikator Selected Count */}
            {selectedCount > 0 && (
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                {selectedCount} Soal Dipilih
              </Badge>
            )}

            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Banner invalid hanya kalau param SUDAH loaded & invalid */}
        {idsLoaded && !hasValidIds && (
          <div className="text-sm text-red-600 border border-red-300 bg-red-50 rounded-md px-3 py-2">
            ID test/kategori pada URL tidak valid. Kembali ke halaman sebelumnya
            lalu buka lagi.
          </div>
        )}

        {/* Filter: search kiri, records kanan */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-3 rounded-md border shadow-sm">
          <div className="w-full md:max-w-md flex gap-2">
            <Input
              placeholder="Cari soal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(1);
                  refetch();
                }
              }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setPage(1);
                refetch();
              }}
            >
              Reset
            </Button>
          </div>

          {/* Pagination Selector */}
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">
              Rows
            </Label>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={paginate}
              onChange={(e) => {
                setPaginate(Number(e.target.value));
                setPage(1); // Reset page saat row berubah
              }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>Semua</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper dengan Max Height dan Sticky Header */}
        <div className="rounded-md border bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-sm relative">
              {/* Sticky Header */}
              <thead className="sticky top-0 z-20 bg-muted/90 backdrop-blur supports-[backdrop-filter]:bg-muted/60 shadow-sm">
                <tr className="text-left border-b border-zinc-200">
                  <th className="p-3 w-[80px]">
                    <Button
                      size="sm"
                      variant={allChecked ? "default" : "outline"}
                      className="h-8 w-full px-2"
                      onClick={() => toggleAll(!allChecked)}
                    >
                      {allChecked ? (
                        <CheckSquare className="h-4 w-4 mr-1.5" />
                      ) : (
                        <Square className="h-4 w-4 mr-1.5" />
                      )}
                      All
                    </Button>
                  </th>
                  <th className="p-3 font-semibold text-zinc-700">
                    Pertanyaan
                  </th>
                  <th className="p-3 w-40 font-semibold text-zinc-700">
                    Kategori
                  </th>
                  <th className="p-3 w-20 font-semibold text-zinc-700">
                    Point
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td className="p-8 text-center" colSpan={4}>
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <RefreshCw className="h-6 w-6 animate-spin mb-2" />
                        Loading data...
                      </div>
                    </td>
                  </tr>
                ) : list.length ? (
                  list.map((q) => (
                    <tr
                      key={q.id}
                      className={`group transition-colors align-top hover:bg-zinc-50 ${
                        selected[q.id] ? "bg-blue-50/60" : ""
                      }`}
                    >
                      <td className="p-3 text-center">
                        <Checkbox
                          checked={!!selected[q.id]}
                          onCheckedChange={(v) =>
                            setSelected((s) => ({ ...s, [q.id]: Boolean(v) }))
                          }
                          className="mt-1"
                        />
                      </td>
                      <td className="p-3">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-zinc-800 line-clamp-3 group-hover:line-clamp-none transition-all"
                          dangerouslySetInnerHTML={{ __html: q.question }}
                        />
                      </td>
                      <td className="p-3 text-zinc-600">
                        <Badge variant="outline" className="font-normal">
                          {q.category_name}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium text-zinc-900">
                        {q.total_point}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="p-8 text-center text-muted-foreground"
                      colSpan={4}
                    >
                      Tidak ada soal ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions: Pagination & Submit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="flex-1">
            {paginate !== 0 && (
              <Pager
                page={data?.current_page ?? 1}
                lastPage={data?.last_page ?? 1}
                onChange={setPage}
              />
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setSelected({})}
              disabled={selectedCount === 0}
            >
              Reset Pilihan
            </Button>
            <Button
              onClick={submit}
              disabled={
                saving ||
                !hasValidIds ||
                !questionCategoryId ||
                selectedCount === 0
              }
              className="px-6"
            >
              {saving
                ? "Menyimpan..."
                : `Tambahkan ${
                    selectedCount > 0 ? `(${selectedCount}) ` : ""
                  }Soal`}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}