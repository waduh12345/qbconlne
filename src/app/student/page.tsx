"use client";

import { useMemo, useState, type ReactNode } from "react";
import { User2, FileSpreadsheet, FileText } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetParticipantHistoryListQuery } from "@/services/student/tryout.service";
import type { ParticipantHistoryItem } from "@/types/student/tryout";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useGetTryoutListQuery } from "@/services/tryout/sub-tryout.service";
import { useGetTestListQuery } from "@/services/tryout/test.service";
import { 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

/** ===== Types ===== */
type GroupedTryoutData = {
  parent: ParticipantHistoryItem;
  subTests: ParticipantHistoryItem[];
};

/** ===== Utils ===== */
function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeStyle: "medium",
      timeZone: "Asia/Jakarta",
    }).format(d);
  } catch {
    return iso ?? "—";
  }
}

/** ===== Page ===== */
export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const nameUser = user?.name;
  const emailUser = user?.email;

  // query hanya jalan kalau user ada
  const queryArg =
    user != null
      ? {
          user_id: user.id,
          paginate: 10,
          orderBy: "updated_at" as const,
        }
      : skipToken;

  const {
    data: history,
    isLoading,
    isError,
  } = useGetParticipantHistoryListQuery(queryArg);

  // ambil 5 terbaru
  const latestTop5 = useMemo(() => {
    const items = (history?.data ?? []).slice();
    const ts = (r: ParticipantHistoryItem): number => {
      const pick =
        r.updated_at ?? r.end_date ?? r.start_date ?? r.created_at ?? null;
      return pick ? new Date(pick).getTime() : 0;
    };
    items.sort((a, b) => ts(b) - ts(a));
    return items.slice(0, 5);
  }, [history]);

  const totalHistory = history?.total ?? 0;

  // Ambil sekolah dari session
  const schoolName = user?.student?.school_name || user?.student?.school?.name || "—";

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-2xl border bg-white/80 px-5 py-4 text-center shadow-sm">
          <p className="text-sm text-zinc-700">
            Kamu belum masuk. Silakan login agar data dashboard dapat dimuat
            dari session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.06),transparent_40%)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 md:px-6">
        {/* Welcome */}
        <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-zinc-100 shadow-sm backdrop-blur md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-grid h-11 w-11 place-items-center rounded-xl bg-sky-500 text-white ring-1 ring-sky-200">
                <User2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold md:text-xl">
                  Selamat Datang {nameUser}
                </p>
                <p className="truncate text-sm text-sky-700">{emailUser}</p>
              </div>
            </div>

          </div>

          {/* baris info */}
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              tone="sky"
              title="Total Paket Saya"
              value={String(totalHistory)}
              subtitle="Riwayat pengerjaan"
            />
            <InfoCard
              title="Aktivitas terbaru"
              description="Daftar di bawah menampilkan 5 pengerjaan terakhir kamu."
              tone="indigo"
            />
            <InfoCard
              title="Tips"
              description="Selesaikan ujian sampai akhir agar status menjadi selesai."
              tone="zinc"
            />
          </div>
        </div>

        {/* Hasil Latihan Terbaru */}
        <div className="rounded-2xl bg-white/80 ring-1 ring-zinc-100 shadow-sm backdrop-blur">
          <div className="border-b border-zinc-100 px-4 py-3 md:px-6">
            <h3 className="font-semibold text-zinc-900">
              Hasil Latihan Terbaru
            </h3>
            <p className="text-xs text-zinc-500">
              Menampilkan {latestTop5.length} aktivitas terakhir
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-sky-50/60 text-zinc-700">
                  <Th>Test</Th>
                  <Th>Mulai</Th>
                  <Th>Selesai</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skeleton-${i}`}
                      className={i % 2 ? "bg-zinc-50/40" : "bg-white/50"}
                    >
                      <Td>
                        <div className="h-4 w-56 animate-pulse rounded bg-zinc-200" />
                      </Td>
                      <Td>
                        <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
                      </Td>
                      <Td>
                        <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
                      </Td>
                      <Td>
                        <div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
                      </Td>
                    </tr>
                  ))}

                {isError && (
                  <tr>
                    <Td colSpan={4}>
                      <span className="text-red-600">Gagal memuat data.</span>
                    </Td>
                  </tr>
                )}

                {!isLoading && !isError && latestTop5.length === 0 && (
                  <tr>
                    <Td colSpan={4}>
                      <span className="text-zinc-600">
                        Belum ada hasil latihan.
                      </span>
                    </Td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  latestTop5.map((r, i) => {
                    const isDone = !!(r.end_date ?? r.updated_at);
                    return (
                      <tr
                        key={r.id}
                        className={i % 2 ? "bg-zinc-50/40" : "bg-white/50"}
                      >
                        <Td>
                          <span className="inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-indigo-500/70" />
                            {r.test_details?.title ?? "—"}
                          </span>
                        </Td>
                        <Td>{formatDateTime(r.start_date)}</Td>
                        <Td>
                          {formatDateTime(r.end_date ?? r.updated_at ?? null)}
                        </Td>
                        <Td>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              isDone
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                            {isDone ? "Selesai" : "Sedang dikerjakan"}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hasil Ujian Tryout */}
        <TryoutResultsSection
          userName={nameUser || "—"}
          userEmail={emailUser || "—"}
          schoolName={schoolName}
        />
      </div>
    </div>
  );
}

/** ===== UI bits ===== */
function Card({
  tone,
  title,
  value,
  subtitle,
  icon,
}: {
  tone: "sky" | "indigo" | "soft";
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  const theme =
    tone === "sky"
      ? {
          wrap: "bg-sky-100/70 ring-sky-200/70",
          value: "text-sky-700",
          chip: "bg-white/60 text-sky-700 ring-1 ring-white/70",
        }
      : tone === "indigo"
      ? {
          wrap: "bg-indigo-700 text-white ring-indigo-800/60",
          value: "text-white",
          chip: "bg-white/10 text-white/90 ring-1 ring-white/20",
        }
      : {
          wrap: "bg-zinc-100/70 ring-zinc-200/80",
          value: "text-zinc-900",
          chip: "bg-sky-600/10 text-sky-700 ring-1 ring-sky-600/20",
        };

  return (
    <div className={`rounded-2xl p-4 ring-1 shadow-sm ${theme.wrap}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm/5 font-medium opacity-80">{title}</p>
          <div className={`mt-1 text-4xl font-semibold ${theme.value}`}>
            {value}
          </div>
          {subtitle && <p className="mt-1 text-xs opacity-80">{subtitle}</p>}
        </div>
        {icon && <div className={`rounded-xl p-2 ${theme.chip}`}>{icon}</div>}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
  tone = "sky",
}: {
  title: string;
  description: string;
  tone?: "sky" | "indigo" | "zinc";
}) {
  const toneMap: Record<
    typeof tone,
    { wrap: string; title: string; desc: string }
  > = {
    sky: {
      wrap: "bg-sky-50/80 ring-1 ring-sky-100",
      title: "text-sky-900",
      desc: "text-sky-700/80",
    },
    indigo: {
      wrap: "bg-indigo-50/80 ring-1 ring-indigo-100",
      title: "text-indigo-900",
      desc: "text-indigo-700/80",
    },
    zinc: {
      wrap: "bg-zinc-50/80 ring-1 ring-zinc-100",
      title: "text-zinc-900",
      desc: "text-zinc-700/80",
    },
  };

  const t = toneMap[tone];

  return (
    <div className={`rounded-2xl p-4 ${t.wrap}`}>
      <p className={`text-sm font-semibold ${t.title}`}>{title}</p>
      <p className={`mt-1 text-xs leading-relaxed ${t.desc}`}>{description}</p>
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
  colSpan,
}: {
  children: ReactNode;
  align?: "left" | "right";
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-3 text-zinc-700 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </td>
  );
}

/** ===== Tryout Results Section ===== */
function TryoutResultsSection({
  userName,
  userEmail,
  schoolName,
}: {
  userName: string;
  userEmail: string;
  schoolName: string;
}) {
  const { data: session } = useSession();
  const user = session?.user;

  // State untuk cascading dropdowns
  const [selectedTryoutId, setSelectedTryoutId] = useState<number | null>(null);
  const [selectedParentTestId, setSelectedParentTestId] = useState<number | null>(null);

  // Fetch Tryout Categories
  const { 
    data: tryoutList, 
    isLoading: isLoadingTryouts 
  } = useGetTryoutListQuery({
    page: 1,
    paginate: 100,
    orderBy: "tryouts.updated_at",
  });

  // Fetch Parent Tests based on selected tryout
  const shouldFetchParentTests = selectedTryoutId !== null;
  const { 
    data: parentTestList, 
    isLoading: isLoadingParentTests 
  } = useGetTestListQuery(
    shouldFetchParentTests
      ? {
          page: 1,
          paginate: 100,
          isParent: true,
          tryout_id: selectedTryoutId,
        }
      : skipToken
  );

  // Fetch Participant History based on selected parent test
  const shouldFetchHistory = user && selectedParentTestId !== null;
  const { 
    data: participantHistory, 
    isLoading: isLoadingHistory 
  } = useGetParticipantHistoryListQuery(
    shouldFetchHistory
      ? {
          user_id: user.id,
          paginate: 100,
          orderBy: "updated_at",
          parent_test_id: selectedParentTestId,
        }
      : skipToken
  );

  // Group data by parent test - tampilkan semua test yang sudah selesai
  const filteredGroupedData = useMemo(() => {
    if (!participantHistory?.data) return [];

    const allItems = participantHistory.data;
    
    // Filter semua test yang sudah selesai dan punya grade
    const completedTests = allItems.filter(
      (item) =>
        (item.end_date || item.updated_at) &&
        item.grade !== undefined
    );

    if (completedTests.length === 0) {
      return [];
    }

    // Cari semua parent test (parent_id null atau tidak ada) yang ada di completedTests
    const parentTests = completedTests.filter(
      (item) =>
        !item.test_details?.parent_id || item.test_details.parent_id === null
    );

    // Untuk setiap parent test, cari semua sub test yang memiliki parent_id sama dengan test_id parent
    const grouped: GroupedTryoutData[] = parentTests.map((parent) => {
      const parentTestId = parent.test_id;
      const subTests = completedTests.filter(
        (item) =>
          item.test_details?.parent_id === parentTestId
      );

      return {
        parent,
        subTests: subTests.length > 0 ? subTests : [parent], // Jika tidak ada sub test, gunakan parent sendiri
      };
    });

    // Cari test yang punya parent_id tapi parent-nya tidak ada di history (orphan tests)
    const orphanTests = completedTests.filter(
      (item) => {
        const parentId = item.test_details?.parent_id;
        if (!parentId) return false; // Skip yang tidak punya parent_id
        
        // Cek apakah parent-nya ada di completedTests
        const parentExists = completedTests.some(
          (test) => test.test_id === parentId
        );
        
        return !parentExists; // Jika parent tidak ada, ini orphan test
      }
    );

    // Tambahkan orphan tests sebagai standalone
    orphanTests.forEach((test) => {
      grouped.push({
        parent: test,
        subTests: [test],
      });
    });

    // Cari test yang tidak punya parent_id dan tidak ada di parent tests (standalone yang belum ditambahkan)
    const standaloneTests = completedTests.filter(
      (item) => {
        const hasParentId = item.test_details?.parent_id;
        if (hasParentId) return false; // Skip yang punya parent_id
        
        // Cek apakah sudah ada di grouped (sebagai parent atau sudah ditambahkan)
        const alreadyAdded = grouped.some(
          (g) => g.parent.id === item.id || g.subTests.some((st) => st.id === item.id)
        );
        
        return !alreadyAdded;
      }
    );

    // Tambahkan standalone tests
    standaloneTests.forEach((test) => {
      grouped.push({
        parent: test,
        subTests: [test],
      });
    });

    return grouped;
  }, [participantHistory]);

  // Data untuk ditampilkan di tabel (deduplicate by test_id, keep newest by created_at)
  const displayTests = useMemo(() => {
    const allTests = filteredGroupedData.flatMap((group) => group.subTests);
    
    // Group by test_id and keep only the newest one
    const testMap = new Map<number, ParticipantHistoryItem>();
    
    allTests.forEach((test) => {
      const testId = test.test_id;
      if (!testId) return;
      
      const existing = testMap.get(testId);
      if (!existing) {
        testMap.set(testId, test);
      } else {
        // Compare created_at and keep the newest one
        const existingDate = new Date(existing.created_at || 0).getTime();
        const currentDate = new Date(test.created_at || 0).getTime();
        
        if (currentDate > existingDate) {
          testMap.set(testId, test);
        }
      }
    });
    
    // Convert map values back to array and sort by test title
    return Array.from(testMap.values()).sort((a, b) => {
      const titleA = a.test_details?.title ?? "";
      const titleB = b.test_details?.title ?? "";
      return titleA.localeCompare(titleB);
    });
  }, [filteredGroupedData]);

  // Hitung total score: setiap test = grade / pembagian, lalu dijumlahkan (tanpa groupedByNumber)
  const totalScore = useMemo(() => {
    if (displayTests.length === 0) return 0;
    
    return displayTests.reduce((sum, test) => {
      const grade = test.grade ?? 0;
      const pembagian = test?.test?.pembagian ?? 1;
      const divisor = pembagian && pembagian > 0 ? pembagian : 1;
      return sum + grade / divisor;
    }, 0);
  }, [displayTests]);

  return (
    <div className="rounded-2xl bg-white/80 ring-1 ring-zinc-100 shadow-sm backdrop-blur">
      <div className="border-b border-zinc-100 px-4 py-3 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold text-zinc-900">Hasil Ujian Tryout</h3>
            <p className="text-xs text-zinc-500">
              Detail hasil ujian yang sudah dinilai
            </p>
          </div>
          {displayTests.length > 0 && (
            <ExportButtons
              groupData={null}
              allGroupData={filteredGroupedData}
              userName={userName}
              userEmail={userEmail}
              schoolName={schoolName}
              totalScore={totalScore}
            />
          )}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Header Info */}
        <div className="mb-6 grid gap-4 rounded-lg bg-sky-50/50 p-4 ring-1 ring-sky-100 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Nama
            </p>
            <p className="mt-1 font-semibold text-zinc-900">{userName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Sekolah
            </p>
            <p className="mt-1 font-semibold text-zinc-900">{schoolName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Email
            </p>
            <p className="mt-1 font-semibold text-zinc-900">{userEmail}</p>
          </div>
        </div>

        {/* Cascading Dropdowns */}
        <div className="mb-4 space-y-4">
          {/* Dropdown 1: Kategori Tryout */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Pilih Kategori Tryout:
            </label>
            <select
              value={selectedTryoutId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTryoutId(value ? Number(value) : null);
                setSelectedParentTestId(null); // Reset parent test selection
              }}
              disabled={isLoadingTryouts}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:bg-zinc-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Pilih Kategori Tryout --</option>
              {tryoutList?.data.map((tryout) => (
                <option key={tryout.id} value={tryout.id}>
                  {tryout.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Parent Test */}
          {selectedTryoutId && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Pilih Tryout Parent:
              </label>
              <select
                value={selectedParentTestId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedParentTestId(value ? Number(value) : null);
                }}
                disabled={isLoadingParentTests || !parentTestList?.data.length}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Pilih Tryout Parent --</option>
                {parentTestList?.data.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.title}
                  </option>
                ))}
              </select>
              {!isLoadingParentTests && !parentTestList?.data.length && (
                <p className="mt-1 text-xs text-amber-600">
                  Tidak ada parent test untuk kategori tryout ini.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoadingHistory && selectedParentTestId && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-zinc-600">Memuat data...</p>
          </div>
        )}

        {/* No Data State */}
        {!isLoadingHistory && selectedParentTestId && displayTests.length === 0 && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-zinc-600">Belum ada hasil ujian yang sudah dinilai untuk tryout parent ini.</p>
          </div>
        )}

        {/* Results Table */}
        {!isLoadingHistory && displayTests.length > 0 && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-sky-50 text-zinc-700">
                    <Th>Nomor</Th>
                    <Th>Sub Test</Th>
                    <Th align="right">Nilai Score</Th>
                  </tr>
                </thead>
                <tbody>
                  {displayTests.map((test, index) => {
                    const grade = test.grade ?? 0;
                    
                    return (
                      <tr
                        key={test.id}
                        className={index % 2 ? "bg-zinc-50/40" : "bg-white"}
                      >
                        <Td>{index + 1}</Td>
                        <Td>
                          <span className="font-medium">
                            {test.test_details?.title ?? "—"}
                          </span>
                        </Td>
                        <Td align="right">
                          <span className="font-semibold text-sky-700">
                            {grade.toFixed(2)}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-sky-100 font-semibold text-zinc-900">
                    <Td colSpan={2}>Score Akhir IRT</Td>
                    <Td align="right">
                      <span className="text-emerald-700">{totalScore.toFixed(2)}</span>
                    </Td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Spider Chart / Radar Chart */}
            <div className="mt-6">
              <h4 className="mb-4 text-sm font-semibold text-zinc-900">
                Visualisasi Nilai per Sub Test
              </h4>
              <div className="rounded-lg border border-zinc-200 bg-white p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={displayTests.map((test) => ({
                    subject: test.test_details?.title?.length > 20 
                      ? test.test_details.title.substring(0, 20) + '...' 
                      : test.test_details?.title ?? "—",
                    fullTitle: test.test_details?.title ?? "—",
                    score: Number((test.grade ?? 0).toFixed(2)),
                  }))}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#52525b', fontSize: 12 }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 'auto']}
                      tick={{ fill: '#71717a', fontSize: 11 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.6}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: number | undefined, _name: string | undefined, props: { payload?: { fullTitle: string } }) => [
                        value?.toFixed(2) ?? '0.00',
                        props.payload?.fullTitle ?? 'N/A'
                      ]}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                  </RadarChart>
                </ResponsiveContainer>
                
                {/* Summary Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs text-zinc-500">Total Score</p>
                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      {totalScore.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500">Rata-rata</p>
                    <p className="mt-1 text-lg font-bold text-indigo-700">
                      {(displayTests.length > 0 
                        ? totalScore / displayTests.length 
                        : 0
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500">Tertinggi</p>
                    <p className="mt-1 text-lg font-bold text-sky-700">
                      {displayTests.length > 0
                        ? Math.max(...displayTests.map(t => {
                            const grade = t.grade ?? 0;
                            const pembagian = t?.test?.pembagian ?? 1;
                            const divisor = pembagian && pembagian > 0 ? pembagian : 1;
                            return grade / divisor;
                          })).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-zinc-500">Terendah</p>
                    <p className="mt-1 text-lg font-bold text-amber-700">
                      {displayTests.length > 0
                        ? Math.min(...displayTests.map(t => {
                            const grade = t.grade ?? 0;
                            const pembagian = t?.test?.pembagian ?? 1;
                            const divisor = pembagian && pembagian > 0 ? pembagian : 1;
                            return grade / divisor;
                          })).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Initial State - No Selection */}
        {!selectedTryoutId && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-zinc-600">Silakan pilih kategori tryout terlebih dahulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** ===== Export Functions (declared before use) ===== */
function exportAllToExcel(
  allGroupData: GroupedTryoutData[],
  userName: string,
  userEmail: string,
  schoolName: string,
  totalScore: number
) {
  // Gabungkan semua sub test dari semua group
  const allSubTests = allGroupData.flatMap((group) => group.subTests);

  // Prepare data
  const worksheetData = [
    ["HASIL UJIAN TRYOUT - SEMUA"],
    [],
    ["Nama", userName],
    ["Sekolah", schoolName],
    ["Email", userEmail],
    [],
    ["Nomor", "Sub Test", "Nilai Score"],
    ...allSubTests.map((test, index) => [
      index + 1,
      test.test_details?.title ?? "—",
      test.grade ?? 0,
    ]),
    [],
    ["Total Score", "", Number(totalScore.toFixed(2))],
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Style: Merge title row
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
  ];

  // Set column widths
  ws["!cols"] = [{ wch: 10 }, { wch: 40 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Hasil Tryout");

  // Generate filename
  const filename = `hasil_ujian_tryout_semua_${new Date().toISOString().split("T")[0]}.xlsx`;

  // Download
  XLSX.writeFile(wb, filename);
}

async function exportAllToPDF(
  allGroupData: GroupedTryoutData[],
  userName: string,
  userEmail: string,
  schoolName: string,
  totalScore: number
) {
  // Gabungkan semua sub test dari semua group
  const allSubTests = allGroupData.flatMap((group) => group.subTests);

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          color: #1f2937;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0ea5e9;
        }
        .header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 10px;
        }
        .info-section {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        thead {
          background: #0ea5e9;
          color: #fff;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        th:last-child {
          text-align: right;
        }
        tbody tr {
          border-bottom: 1px solid #e5e7eb;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        td {
          padding: 12px;
          font-size: 13px;
        }
        td:last-child {
          text-align: right;
          font-weight: 600;
          color: #0ea5e9;
        }
        tfoot {
          background: #0ea5e9;
          color: #fff;
          font-weight: bold;
        }
        tfoot td {
          color: #fff;
          font-size: 14px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 11px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HASIL UJIAN TRYOUT - SEMUA</h1>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <div class="info-label">Nama</div>
          <div class="info-value">${userName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Sekolah</div>
          <div class="info-value">${schoolName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${userEmail}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nomor</th>
            <th>Sub Test</th>
            <th>Nilai Score</th>
          </tr>
        </thead>
        <tbody>
          ${allSubTests
            .map(
              (test, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${test.test_details?.title ?? "—"}</td>
              <td>${test.grade ?? 0}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">Total Score</td>
            <td>${totalScore.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="footer">
        Dokumen ini dihasilkan pada ${new Date().toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </div>
    </body>
    </html>
  `;

  // Create temporary element
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup diblokir. Izinkan popup untuk mengunduh PDF.");
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then generate PDF
  setTimeout(async () => {
    try {
      const canvas = await html2canvas(printWindow.document.body, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `hasil_ujian_tryout_semua_${new Date().toISOString().split("T")[0]}.pdf`;

      pdf.save(filename);
      printWindow.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
      printWindow.close();
    }
  }, 500);
}

/** ===== Export Buttons Component ===== */
function ExportButtons({
  groupData,
  allGroupData,
  userName,
  userEmail,
  schoolName,
  totalScore,
}: {
  groupData: GroupedTryoutData | null;
  allGroupData: GroupedTryoutData[] | null;
  userName: string;
  userEmail: string;
  schoolName: string;
  totalScore: number;
}) {
  const handleExportExcel = () => {
    if (allGroupData) {
      exportAllToExcel(allGroupData, userName, userEmail, schoolName, totalScore);
    } else if (groupData) {
      exportToExcel(groupData, userName, userEmail, schoolName, totalScore);
    }
  };

  const handleExportPDF = async () => {
    if (allGroupData) {
      await exportAllToPDF(allGroupData, userName, userEmail, schoolName, totalScore);
    } else if (groupData) {
      await exportToPDF(groupData, userName, userEmail, schoolName, totalScore);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportExcel}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPDF}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
}

/** ===== Export Functions ===== */
function exportToExcel(
  groupData: GroupedTryoutData,
  userName: string,
  userEmail: string,
  schoolName: string,
  totalScore: number
) {
  const subTests = groupData.subTests;
  const parentTitle = groupData.parent.test_details?.title ?? "Tryout";

  // Prepare data
  const worksheetData = [
    ["HASIL UJIAN TRYOUT"],
    [],
    ["Nama", userName],
    ["Sekolah", schoolName],
    ["Email", userEmail],
    ["Judul Tryout", parentTitle],
    [],
    ["Nomor", "Sub Test", "Nilai Score"],
    ...subTests.map((test, index) => [
      index + 1,
      test.test_details?.title ?? "—",
      test.grade ?? 0,
    ]),
    [],
    ["Total Score", "", Number(totalScore.toFixed(2))],
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Style: Merge title row
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
  ];

  // Set column widths
  ws["!cols"] = [{ wch: 10 }, { wch: 40 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(wb, ws, "Hasil Tryout");

  // Generate filename
  const testTitle = parentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const filename = `hasil_ujian_tryout_${testTitle}_${new Date().toISOString().split("T")[0]}.xlsx`;

  // Download
  XLSX.writeFile(wb, filename);
}

async function exportToPDF(
  groupData: GroupedTryoutData,
  userName: string,
  userEmail: string,
  schoolName: string,
  totalScore: number
) {
  const subTests = groupData.subTests;
  const parentTitle = groupData.parent.test_details?.title ?? "Tryout";

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          color: #1f2937;
          background: #fff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0ea5e9;
        }
        .header h1 {
          font-size: 24px;
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 10px;
        }
        .info-section {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
        }
        .test-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
          padding: 10px;
          background: #f8fafc;
          border-left: 4px solid #0ea5e9;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        thead {
          background: #0ea5e9;
          color: #fff;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        th:last-child {
          text-align: right;
        }
        tbody tr {
          border-bottom: 1px solid #e5e7eb;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        td {
          padding: 12px;
          font-size: 13px;
        }
        td:last-child {
          text-align: right;
          font-weight: 600;
          color: #0ea5e9;
        }
        tfoot {
          background: #0ea5e9;
          color: #fff;
          font-weight: bold;
        }
        tfoot td {
          color: #fff;
          font-size: 14px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          font-size: 11px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HASIL UJIAN TRYOUT</h1>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <div class="info-label">Nama</div>
          <div class="info-value">${userName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Sekolah</div>
          <div class="info-value">${schoolName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${userEmail}</div>
        </div>
      </div>

      <div class="test-title">
        ${parentTitle}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nomor</th>
            <th>Sub Test</th>
            <th>Nilai Score</th>
          </tr>
        </thead>
        <tbody>
          ${subTests
            .map(
              (test, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${test.test_details?.title ?? "—"}</td>
              <td>${test.grade ?? 0}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">Total Score</td>
            <td>${totalScore.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div class="footer">
        Dokumen ini dihasilkan pada ${new Date().toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </div>
    </body>
    </html>
  `;

  // Create temporary element
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup diblokir. Izinkan popup untuk mengunduh PDF.");
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then generate PDF
  setTimeout(async () => {
    try {
      const canvas = await html2canvas(printWindow.document.body, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const testTitle = parentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const filename = `hasil_ujian_tryout_${testTitle}_${new Date().toISOString().split("T")[0]}.pdf`;

      pdf.save(filename);
      printWindow.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
      printWindow.close();
    }
  }, 500);
}
