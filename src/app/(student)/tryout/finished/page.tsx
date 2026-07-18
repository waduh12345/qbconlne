"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetParticipantHistoryListQuery } from "@/services/student/tryout.service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ParticipantHistoryItem } from "@/types/student/tryout";

type WithScoreBreakdown = { total_correct: number; total_incorrect: number };
function hasBreakdown(
  x: unknown
): x is ParticipantHistoryItem & WithScoreBreakdown {
  return (
    typeof x === "object" &&
    x !== null &&
    "total_correct" in x &&
    "total_incorrect" in x
  );
}

export default function TryoutResultPage() {
  const params = useParams<{ testId: string }>();
  const sp = useSearchParams();
  const justFinished = sp.get("justFinished") === "1";
  const testId = Number(params.testId);

  // ✅ Ambil SEMUA riwayat (tanpa filter is_completed / is_ongoing)
  const { data, isFetching } = useGetParticipantHistoryListQuery({
    page: 1,
    paginate: 100,
  });

  const attempts = useMemo<ParticipantHistoryItem[]>(() => {
    const all = data?.data ?? [];
    return all
      .filter((i) => i.test_id === testId)
      .sort((a, b) => {
        const ta = a.end_date ?? a.updated_at;
        const tb = b.end_date ?? b.updated_at;
        return new Date(ta).getTime() - new Date(tb).getTime();
      });
  }, [data, testId]);

  const latest = attempts[attempts.length - 1];
  const showBreakdown = !!latest && hasBreakdown(latest);

  const chartData = attempts.map((a) => ({
    label: new Date(a.end_date ?? a.updated_at).toLocaleString("id-ID"),
    Nilai: a.grade ?? 0,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/tryout">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Hasil Tryout</h1>
        <div />
      </div>

      {/* Banner selesai */}
      {justFinished && latest && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sky-900">
          <div className="font-semibold">Sesi selesai 🎉</div>
          <div className="text-sm">
            Nilai terakhir:{" "}
            <span className="font-semibold">{latest.grade ?? 0}</span>
            {showBreakdown && (
              <>
                {" • "}
                Benar:{" "}
                <span className="font-semibold">{latest.total_correct}</span>
                {" | "}Salah:{" "}
                <span className="font-semibold">{latest.total_incorrect}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chart Card */}
      <section className="overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-1 text-base font-semibold text-zinc-800">
          Perkembangan Nilai
        </div>
        <div className="mb-3 text-sm text-zinc-600">
          Ringkasan nilai dari test yang pernah kamu kerjakan.
        </div>
        {isFetching ? (
          <div className="h-56 animate-pulse rounded-xl bg-zinc-100" />
        ) : attempts.length ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, bottom: 30, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Nilai" fill="rgba(14,165,233,0.7)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-zinc-600">
            Belum ada hasil.
          </div>
        )}
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-zinc-50 text-left text-sm font-semibold">
              <tr>
                <th className="px-5 py-3">No</th>
                <th className="px-5 py-3">Mulai</th>
                <th className="px-5 py-3">Selesai</th>
                <th className="px-5 py-3">Nilai</th>
                {showBreakdown && (
                  <>
                    <th className="px-5 py-3">Benar</th>
                    <th className="px-5 py-3">Salah</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {attempts.map((a, idx) => {
                const rowHasBreakdown = hasBreakdown(a);
                return (
                  <tr key={a.id} className="text-sm hover:bg-zinc-50/60">
                    <td className="px-5 py-3">{idx + 1}</td>
                    <td className="px-5 py-3">
                      {new Date(a.start_date ?? a.created_at).toLocaleString(
                        "id-ID"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {a.end_date
                        ? new Date(a.end_date).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-5 py-3 font-semibold">{a.grade ?? 0}</td>
                    {showBreakdown && (
                      <>
                        <td className="px-5 py-3">
                          {rowHasBreakdown ? a.total_correct : "-"}
                        </td>
                        <td className="px-5 py-3">
                          {rowHasBreakdown ? a.total_incorrect : "-"}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {!attempts.length && (
                <tr>
                  <td
                    className="px-5 py-8 text-center text-zinc-500"
                    colSpan={showBreakdown ? 6 : 4}
                  >
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}