"use client";

/**
 * SpiderComparisonView
 *
 * Menampilkan radar (spider web) multi-series untuk satu Kategori Tryout.
 * Setiap "seri tryout" yang sudah terisi (is_filled === true) menjadi 1
 * layer pada radar dengan warna yang berbeda. Yang belum terisi tidak
 * ditampilkan di chart, tetapi tetap muncul di tabel sebagai placeholder.
 *
 * Untuk sementara komponen ini menggunakan data dummy (lihat
 * `generateDummySpiderData`). Saat API tersedia, ganti data sumber lewat
 * prop `data` dari hasil RTK Query.
 */

import { useMemo, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/* ===================== Types ===================== */

export type SpiderSeries = {
  series_id: number;
  series_title: string; // "Seri 1", "TO Pemantapan", dll
  is_filled: boolean;
  scores: Record<string, number>; // axis_label -> nilai (0-100 atau skala lain)
  // metadata untuk navigasi ke halaman detail
  participant_test_id?: number | null;
};

export type SpiderCategoryData = {
  category_id: number;
  category_title: string;
  axes: string[]; // urut. Contoh: ["PPU", "PBM", "PK", "PM"]
  // skala maksimum sumbu (auto bila tidak diisi). Contoh: 100 atau 1000
  max_value?: number;
  series: SpiderSeries[]; // urut by seri (Seri 1, 2, ...)
};

/* ===================== Color palette ===================== */

const SERIES_COLORS = [
  "#6366f1", // indigo-500
  "#0ea5e9", // sky-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
  "#8b5cf6", // violet-500
  "#14b8a6", // teal-500
  "#ef4444", // red-500
];

/* ===================== Dummy generator ===================== */

const DEFAULT_DUMMY_AXES = ["PPU", "PBM", "PK", "PM", "Lit. Indo", "Lit. Eng"];

/**
 * Generate dummy data untuk testing UI sebelum API tersedia.
 * @param totalSeries  total seri tryout dalam kategori (mis. 5)
 * @param filledSeries jumlah seri yang sudah dikerjakan siswa (mis. 3)
 */
export function generateDummySpiderData(opts: {
  categoryId: number;
  categoryTitle: string;
  totalSeries?: number;
  filledSeries?: number;
  axes?: string[];
}): SpiderCategoryData {
  const total = opts.totalSeries ?? 5;
  const filled = Math.min(opts.filledSeries ?? 3, total);
  const axes = opts.axes ?? DEFAULT_DUMMY_AXES;

  // Seed sederhana berdasarkan categoryId supaya hasil deterministic per
  // kategori (tidak berubah-ubah saat re-render).
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const series: SpiderSeries[] = Array.from({ length: total }).map((_, i) => {
    const isFilled = i < filled;
    const baseScore = 60 + (i % 3) * 8; // bervariasi per seri
    const scores: Record<string, number> = {};
    axes.forEach((axis, j) => {
      const r = rng(opts.categoryId * 100 + i * 10 + j);
      scores[axis] = isFilled
        ? Math.round(baseScore + r * 35) // 60..95-an
        : 0;
    });
    return {
      series_id: i + 1,
      series_title: `Seri ${i + 1}`,
      is_filled: isFilled,
      scores,
      participant_test_id: isFilled ? 1000 + i : null,
    };
  });

  return {
    category_id: opts.categoryId,
    category_title: opts.categoryTitle,
    axes,
    max_value: 100,
    series,
  };
}

/* ===================== Helpers ===================== */

/** Bentuk data agar siap dikonsumsi recharts:
 *  [{ axis: "PPU", "Seri 1": 80, "Seri 2": 85 }, ...] */
function toRadarData(
  data: SpiderCategoryData,
  filledOnly: boolean = true,
): Array<Record<string, string | number>> {
  const series = filledOnly
    ? data.series.filter((s) => s.is_filled)
    : data.series;
  return data.axes.map((axis) => {
    const row: Record<string, string | number> = { axis };
    series.forEach((s) => {
      row[s.series_title] = s.scores[axis] ?? 0;
    });
    return row;
  });
}

/* ===================== Component ===================== */

type Props = {
  /** Bila tersedia, gunakan data dari API. Kalau undefined, fallback ke dummy. */
  data?: SpiderCategoryData;
  /** ID kategori — dipakai sebagai seed dummy. */
  categoryId: number;
  /** Title kategori — dipakai untuk label dummy. */
  categoryTitle: string;
  /** Toggle untuk paksa pakai dummy meski `data` ada (handy saat dev). */
  forceDummy?: boolean;
};

export default function SpiderComparisonView({
  data,
  categoryId,
  categoryTitle,
  forceDummy = false,
}: Props) {
  // === Mode dummy / kontrol jumlah seri terisi (UI testing) ===
  const [useDummy, setUseDummy] = useState<boolean>(forceDummy || !data);
  const [dummyTotal, setDummyTotal] = useState<number>(5);
  const [dummyFilled, setDummyFilled] = useState<number>(3);

  const effectiveData: SpiderCategoryData = useMemo(() => {
    if (useDummy) {
      return generateDummySpiderData({
        categoryId,
        categoryTitle,
        totalSeries: dummyTotal,
        filledSeries: dummyFilled,
      });
    }
    return data!;
  }, [useDummy, data, categoryId, categoryTitle, dummyTotal, dummyFilled]);

  const filledSeries = useMemo(
    () => effectiveData.series.filter((s) => s.is_filled),
    [effectiveData],
  );

  const radarData = useMemo(
    () => toRadarData(effectiveData, true),
    [effectiveData],
  );

  // Hitung rata-rata per axis (mata pelajaran) — hanya dari seri yang terisi
  const axisAverages = useMemo(() => {
    if (filledSeries.length === 0) return {} as Record<string, number>;
    const result: Record<string, number> = {};
    effectiveData.axes.forEach((axis) => {
      const sum = filledSeries.reduce((s, sr) => s + (sr.scores[axis] ?? 0), 0);
      result[axis] = sum / filledSeries.length;
    });
    return result;
  }, [effectiveData, filledSeries]);

  // Hitung total per seri
  const seriesTotals = useMemo(() => {
    const result: Record<number, number> = {};
    effectiveData.series.forEach((s) => {
      result[s.series_id] = effectiveData.axes.reduce(
        (sum, axis) => sum + (s.scores[axis] ?? 0),
        0,
      );
    });
    return result;
  }, [effectiveData]);

  return (
    <div className="space-y-4">
      {/* Header + dev controls (dummy mode) */}
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            Perbandingan Antar Seri Tryout
          </p>
          <p className="text-xs text-zinc-500">
            Kategori: <span className="font-medium">{categoryTitle}</span> •{" "}
            <span className="font-medium">{filledSeries.length}</span> dari{" "}
            <span className="font-medium">{effectiveData.series.length}</span>{" "}
            seri terisi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Switch
              id="dummy-toggle"
              checked={useDummy}
              onCheckedChange={setUseDummy}
              disabled={!data}
            />
            <Label htmlFor="dummy-toggle" className="cursor-pointer">
              Mode Dummy
            </Label>
          </div>

          {useDummy && (
            <>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500">Total seri:</span>
                <select
                  value={dummyTotal}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDummyTotal(v);
                    if (dummyFilled > v) setDummyFilled(v);
                  }}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
                >
                  {[3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500">Terisi:</span>
                <select
                  value={dummyFilled}
                  onChange={(e) => setDummyFilled(Number(e.target.value))}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
                >
                  {Array.from({ length: dummyTotal + 1 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filledSeries.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-600">
            Belum ada seri tryout yang dikerjakan di kategori ini.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Selesaikan minimal satu seri agar grafik perbandingan bisa
            ditampilkan.
          </p>
        </div>
      ) : (
        <>
          {/* Radar chart multi-series */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: "#52525b", fontSize: 12 }}
                  tickLine={{ stroke: "#e5e7eb" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, effectiveData.max_value ?? "auto"]}
                  tick={{ fill: "#71717a", fontSize: 11 }}
                />
                {filledSeries.map((s, idx) => {
                  const color = SERIES_COLORS[idx % SERIES_COLORS.length];
                  return (
                    <Radar
                      key={s.series_id}
                      name={s.series_title}
                      dataKey={s.series_title}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                  );
                })}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "12px" }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabel comparison: rows = axis (mata pelajaran), cols = setiap seri */}
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-sky-50 text-zinc-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Mata Pelajaran
                  </th>
                  {effectiveData.series.map((s, idx) => {
                    const color = s.is_filled
                      ? SERIES_COLORS[
                          filledSeries.findIndex(
                            (f) => f.series_id === s.series_id,
                          ) % SERIES_COLORS.length
                        ]
                      : "#a1a1aa";
                    return (
                      <th
                        key={s.series_id}
                        className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                        style={{ color }}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {s.is_filled && (
                            <span
                              className="inline-block h-2 w-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          )}
                          {s.series_title}
                          {!s.is_filled && (
                            <span className="ml-1 rounded-full bg-zinc-200 px-1.5 py-0.5 text-[10px] font-normal normal-case text-zinc-600">
                              belum
                            </span>
                          )}
                        </div>
                        {/* Sub label: index-only, untuk kolom kecil */}
                        <div className="mt-0.5 text-[10px] font-normal text-zinc-500 normal-case">
                          {s.is_filled
                            ? `Total: ${seriesTotals[s.series_id].toFixed(0)}`
                            : "-"}
                        </div>
                        {/* sembunyikan unused idx untuk lint */}
                        <span className="hidden">{idx}</span>
                      </th>
                    );
                  })}
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Rata-rata
                  </th>
                </tr>
              </thead>
              <tbody>
                {effectiveData.axes.map((axis, rowIdx) => (
                  <tr
                    key={axis}
                    className={rowIdx % 2 ? "bg-zinc-50/40" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium text-zinc-800">
                      {axis}
                    </td>
                    {effectiveData.series.map((s) => {
                      const v = s.scores[axis] ?? 0;
                      return (
                        <td
                          key={s.series_id}
                          className={`px-4 py-3 text-right tabular-nums ${
                            s.is_filled ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {s.is_filled ? v : "-"}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700 tabular-nums">
                      {(axisAverages[axis] ?? 0).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-sky-100 font-semibold text-zinc-900">
                  <td className="px-4 py-3 text-left">Total per Seri</td>
                  {effectiveData.series.map((s) => (
                    <td
                      key={s.series_id}
                      className={`px-4 py-3 text-right tabular-nums ${
                        s.is_filled ? "" : "text-zinc-400"
                      }`}
                    >
                      {s.is_filled ? seriesTotals[s.series_id].toFixed(0) : "-"}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right text-emerald-700 tabular-nums">
                    {filledSeries.length > 0
                      ? (
                          Object.values(axisAverages).reduce(
                            (a, b) => a + b,
                            0,
                          ) / effectiveData.axes.length
                        ).toFixed(1)
                      : "-"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
