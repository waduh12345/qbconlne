"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  useGetTestListQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} from "@/services/tryout/test.service";
import { useExportTestMutation } from "@/services/tryout/export-test.service";
import { useGetSchoolListQuery } from "@/services/master/school.service";
import { useGetUsersListQuery } from "@/services/users-management.service";
import { useGetTryoutListQuery } from "@/services/tryout/sub-tryout.service";
import { useGetMeQuery } from "@/services/auth.service";
import type { Test, TestPayload } from "@/types/tryout/test";
import type { Users } from "@/types/user";
import type { School } from "@/types/master/school";
import type { Tryout } from "@/services/tryout/sub-tryout.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ListChecks,
  FileDown,
  PenLine,
  Trash2,
  Plus,
  RefreshCw,
  Trophy,
  Users as UsersIcon,
  BarChart3,
  Filter,
} from "lucide-react";
import Pager from "@/components/ui/tryout-pagination";
import ActionIcon from "@/components/ui/action-icon";
import { SiteHeader } from "@/components/site-header";
import TryoutForm, {
  FormState,
  TimerType,
  ScoreType,
  AssessmentType,
} from "@/components/form-modal/tryout-admin-form";
import { Combobox } from "@/components/ui/combo-box";
import TryoutMonitoringDialog from "@/components/modal/tryout/monitoring-student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interface untuk baris data tabel
type TestRow = Test & {
  user_id?: number | null;
  pengawas_name?: string | null;
  schools?: School[];
  parent_id?: number | null;
  tryout_id?: number | null;
  all_school?: number | boolean;
  school_excepts?: School[]; // Tambahkan ini agar bisa diakses di tabel
};

const emptyForm: FormState = {
  school_id: [] as number[],
  school_except_id: [] as number[],
  all_school: 1,
  title: "",
  sub_title: "",
  slug: "",
  description: "",
  total_time: 3600,
  total_questions: 0,
  pass_grade: 70,
  shuffle_questions: false,
  assessment_type: "irt",
  timer_type: "per_test",
  score_type: "default",
  start_date: "",
  end_date: "",
  code: "",
  max_attempts: "",
  is_graded: false,
  is_explanation_released: false,
  user_id: 0,
  status: 1,
  parent_id: null,
  tryout_id: null,
};

function dateOnly(input?: string | null): string {
  if (!input) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  const s = String(input);
  if (s.includes("T") || s.includes(" ")) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TryoutPage() {
  const [page, setPage] = useState(1);
  const [paginate, setPaginate] = useState(10);
  const [search, setSearch] = useState("");
  const [searchBySpecific, setSearchBySpecific] = useState("");
  const [exportingId, setExportingId] = useState<number | null>(null);

  // 🔹 Filter States
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [schoolSearch, setSchoolSearch] = useState("");

  const [parentId, setParentId] = useState<number | null>(null);
  const [tryoutId, setTryoutId] = useState<number | null>(null);
  const [isParentFilter, setIsParentFilter] = useState<string>("all");

  // 🔹 Fetch Helper (Parent & Tryout)
  const [parentSearch, setParentSearch] = useState("");
  const { data: parentResp, refetch: refetchParentList } = useGetTestListQuery({
    page: 1,
    paginate: 50,
    search: parentSearch,
    isParent: 1,
  });
  const parentList = (parentResp?.data as Test[]) ?? [];

  const [tryoutSearch, setTryoutSearch] = useState("");
  const { data: tryoutResp, refetch: refetchTryoutList } =
    useGetTryoutListQuery({
      page: 1,
      paginate: 50,
      search: tryoutSearch,
      status: 1,
    });
  const tryoutList = (tryoutResp?.data as Tryout[]) ?? [];

  const { data: me } = useGetMeQuery();
  const roles = me?.roles ?? [];
  const isSuperadmin = roles.some((r) => r.name === "superadmin");
  const isPengawas = roles.some((r) => r.name === "pengawas");
  const myId = me?.id ?? 0;

  // 🔹 ambil data sekolah
  const {
    data: schoolResp,
    isLoading: loadingSchools,
    refetch: refetchSchools,
  } = useGetSchoolListQuery(
    { page: 1, paginate: 100, search: schoolSearch || "" },
    { refetchOnMountOrArgChange: true }
  );

  const schools: School[] = useMemo(() => schoolResp?.data ?? [], [schoolResp]);

  // 🔹 query utama
  const baseQuery = {
    page,
    paginate,
    search,
    searchBySpecific,
    orderBy: "tests.updated_at",
    orderDirection: "desc" as const,
    school_id: schoolId ?? undefined,
    parent_id: parentId ?? undefined,
    tryout_id: tryoutId ?? undefined,
    isParent: isParentFilter === "parent" ? 1 : undefined,
  };

  const finalQuery =
    !isSuperadmin && isPengawas
      ? {
          ...baseQuery,
          searchBySpecific: "user_id" as const,
          search: String(myId),
        }
      : baseQuery;

  const { data, isLoading, refetch } = useGetTestListQuery(finalQuery);

  const { data: pengawasResp } = useGetUsersListQuery({
    page: 1,
    paginate: 200,
    search: "",
    role_id: 3,
  });
  const pengawasMap = useMemo(() => {
    const m = new Map<number, string>();
    (pengawasResp?.data ?? []).forEach((u: Users) => m.set(u.id, u.name));
    return m;
  }, [pengawasResp]);

  const [createTest, { isLoading: creating }] = useCreateTestMutation();
  const [updateTest, { isLoading: updating }] = useUpdateTestMutation();
  const [deleteTest] = useDeleteTestMutation();
  const [exportTest] = useExportTestMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TestRow | null>(null);
  const [monitoringTest, setMonitoringTest] = useState<TestRow | null>(null);

  // ✅ Convert Row to Form (Initial)
  const toForm = (t: TestRow): FormState => {
    // Di sini kita hanya mapping data basic. Detail lengkap (termasuk excepts)
    // akan diambil ulang di dalam component form via useGetTestByIdQuery.
    return {
      id: t.id, // Penting kirim ID agar form fetch detail
      school_id: t.schools?.map((s) => s.id) ?? [],
      school_except_id: [], // Placeholder, nanti diisi ulang di form
      all_school: t.all_school ? 1 : 0,
      title: t.title,
      sub_title: t.sub_title ?? "",
      slug: t.slug ?? "",
      description: t.description ?? "",
      total_time: t.total_time,
      total_questions: t.total_questions,
      pass_grade: t.pass_grade,
      shuffle_questions: t.shuffle_questions,
      assessment_type: t.assessment_type as AssessmentType,
      timer_type: t.timer_type as TimerType,
      score_type: (t.score_type as ScoreType) ?? "default",
      start_date: dateOnly(t.start_date),
      end_date: dateOnly(t.end_date),
      code: t.code ?? "",
      max_attempts: t.max_attempts ?? "",
      is_graded: t.is_graded,
      is_explanation_released: t.is_explanation_released,
      user_id: t.user_id ?? 0,
      status: t.status ? 1 : 0,
      parent_id: t.parent_id ?? null,
      tryout_id: t.tryout_id ?? null,
    };
  };

  const toPayload = (f: FormState): TestPayload => {
    const payload: TestPayload = {
      all_school: f.all_school,
      school_except_id: f.school_except_id,
      school_id: f.all_school === 1 ? [] : f.school_id,
      title: f.title,
      sub_title: f.sub_title || null,
      shuffle_questions: f.shuffle_questions ? 1 : 0,
      timer_type: f.timer_type,
      score_type: f.score_type,
      slug: f.slug,
      description: f.description,
      total_questions: f.total_questions,
      pass_grade: f.pass_grade,
      assessment_type: f.assessment_type,
      code: f.code || "",
      max_attempts: f.max_attempts || "",
      is_graded: f.is_graded,
      is_explanation_released: f.is_explanation_released,
      user_id: Number(f.user_id || 0),
      status: Number(f.status || 0),
      parent_id: f.parent_id,
      tryout_id: f.tryout_id,
    };

    if (f.timer_type === "per_test") {
      payload.total_time = Number(f.total_time || 0);
    }

    const sd = dateOnly(f.start_date);
    const ed = dateOnly(f.end_date);
    if (sd) payload.start_date = sd;
    if (ed) payload.end_date = ed;

    return payload;
  };

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (t: TestRow) => {
    setEditing(t);
    setOpen(true);
  };

  const onSubmit = async (values: FormState): Promise<boolean> => {
    const fixedValues =
      !isSuperadmin && isPengawas ? { ...values, user_id: myId } : values;

    try {
      let res: { title: string };

      if (editing) {
        res = await updateTest({
          id: editing.id,
          payload: toPayload(fixedValues),
        }).unwrap();
      } else {
        res = await createTest(toPayload(fixedValues)).unwrap();
      }

      setOpen(false);
      setEditing(null);
      refetch();

      setTimeout(() => {
        void Swal.fire({
          icon: "success",
          title: editing ? "Updated" : "Created",
          text: `Test "${res.title}" ${editing ? "diperbarui" : "dibuat"}.`,
        });
      }, 30);

      return true;
    } catch (e) {
      setTimeout(() => {
        void Swal.fire({
          icon: "error",
          title: "Gagal",
          text: e instanceof Error ? e.message : String(e),
        });
      }, 30);

      return false;
    }
  };

  const onDelete = async (id: number, label: string) => {
    const ask = await Swal.fire({
      icon: "warning",
      title: "Hapus Test?",
      text: `Data "${label}" akan dihapus permanen.`,
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!ask.isConfirmed) return;
    try {
      await deleteTest(id).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Terhapus",
        text: `"${label}" dihapus.`,
      });
      refetch();
    } catch (e) {
      await Swal.fire({ icon: "error", title: "Gagal", text: String(e) });
    }
  };

  const onExport = async (id: number) => {
    try {
      setExportingId(id);
      const res = await exportTest({ test_id: id }).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Export dimulai",
        text: res.data || res.message,
      });
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Export gagal",
        text: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setExportingId(null);
    }
  };

  const resetFilters = () => {
    setSearch("");
    if (isSuperadmin) setSearchBySpecific("");
    setSchoolId(null);
    setParentId(null);
    setTryoutId(null);
    setIsParentFilter("all");
    setPage(1);
    refetch();
  };

  const tableRows: TestRow[] = useMemo(
    () => (data?.data as TestRow[]) ?? [],
    [data]
  );

  const fromEntry = data?.total === 0 ? 0 : (page - 1) * paginate + 1;
  const toEntry = Math.min(
    fromEntry + (data?.data?.length || 0) - 1,
    data?.total || 0
  );

  return (
    <>
      <SiteHeader title="Try Out" />
      {open && (
        <div className="fixed inset-0 z-40 pointer-events-auto">
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute -top-32 -right-10 h-72 w-72 rounded-full bg-black/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-black/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>
      )}
      <div className="p-4 md:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">Daftar Paket Latihan</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh
              </Button>
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" /> Buat Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* --- Filter Bar --- */}
            <div className="flex flex-col gap-4 rounded-lg border p-3 bg-muted/20">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Cari Judul..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && refetch()}
                    className="bg-white"
                  />
                </div>

                <div className="w-full md:w-48">
                  <Combobox<School>
                    value={schoolId}
                    onChange={(v) => {
                      setSchoolId(v);
                      setPage(1);
                    }}
                    onSearchChange={setSchoolSearch}
                    onOpenRefetch={refetchSchools}
                    data={schools}
                    isLoading={loadingSchools}
                    placeholder="Filter Sekolah"
                    getOptionLabel={(s) => s.name}
                  />
                </div>

                <div className="w-full md:w-48">
                  <Select
                    value={isParentFilter}
                    onValueChange={(v) => {
                      setIsParentFilter(v);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="bg-white w-full">
                      <SelectValue placeholder="Tipe Paket" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="parent">
                        Hanya Induk (Kategori)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-1/2">
                  <Combobox<Tryout>
                    value={tryoutId}
                    onChange={(v) => {
                      setTryoutId(v);
                      setPage(1);
                    }}
                    onSearchChange={setTryoutSearch}
                    onOpenRefetch={refetchTryoutList}
                    data={tryoutList}
                    getOptionLabel={(t) => t.title}
                    placeholder="Filter Tryout"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Combobox<Test>
                    value={parentId}
                    onChange={(v) => {
                      setParentId(v);
                      setPage(1);
                    }}
                    onSearchChange={setParentSearch}
                    onOpenRefetch={refetchParentList}
                    data={parentList}
                    getOptionLabel={(t) => t.title}
                    placeholder="Filter Induk Paket"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={resetFilters}
                  className="shrink-0"
                >
                  <Filter className="mr-2 h-4 w-4" /> Reset Filter
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Menampilkan {fromEntry} - {toEntry} dari {data?.total ?? 0} data
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Limit:</span>
                <select
                  className="h-8 rounded-md border bg-background px-2 text-sm"
                  value={paginate}
                  onChange={(e) => {
                    setPaginate(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="p-3">Judul</th>
                    <th className="p-3">Parent / Tryout</th>
                    <th className="p-3">Sekolah</th>
                    <th className="p-3">Waktu (detik)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="p-4 text-center" colSpan={10}>
                        <div className="flex justify-center items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" /> Memuat
                          data...
                        </div>
                      </td>
                    </tr>
                  ) : tableRows.length ? (
                    tableRows.map((t) => {
                      const name =
                        t.pengawas_name ??
                        (t.user_id ? pengawasMap.get(t.user_id) : undefined) ??
                        "-";
                      return (
                        <tr
                          key={t.id}
                          className="border-t align-top hover:bg-muted/10 transition-colors"
                        >
                          <td className="p-3 min-w-[200px]">
                            <div className="font-medium text-base">
                              {t.title}
                            </div>
                            {t.sub_title && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {t.sub_title}
                              </div>
                            )}
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <UsersIcon className="h-3 w-3" /> {name}
                            </div>
                          </td>
                          <td className="p-3 min-w-[150px]">
                            <div className="flex flex-col gap-1">
                              {t.parent_id ? (
                                <Badge variant="outline" className="w-fit">
                                  Sub Paket
                                </Badge>
                              ) : (
                                <Badge className="w-fit bg-sky-500 hover:bg-sky-600">
                                  Induk Paket
                                </Badge>
                              )}
                              {t.tryout_id && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Trophy className="h-3 w-3" /> Tryout ID:{" "}
                                  {t.tryout_id}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 min-w-[180px]">
                            {/* LOGIK TAMPILAN SEKOLAH */}
                            {t.all_school ? (
                              <div className="flex flex-col gap-1">
                                <Badge
                                  variant="default"
                                  className="w-fit bg-emerald-600 hover:bg-emerald-700"
                                >
                                  Semua Sekolah
                                </Badge>
                                {/* Cek jika ada sekolah yang dikecualikan */}
                                {t.school_excepts &&
                                  t.school_excepts.length > 0 && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      <span className="font-semibold text-red-500 block mb-1">
                                        Kecuali:
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {t.school_excepts.map((s) => (
                                          <Badge
                                            key={s.id}
                                            variant="outline"
                                            className="text-[10px] text-red-500 border-red-200"
                                          >
                                            {s.name}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ) : // Tampilan Manual
                            t.schools && t.schools.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {t.schools.slice(0, 2).map((s) => (
                                  <Badge
                                    key={s.id}
                                    variant="secondary"
                                    className="font-normal text-[10px]"
                                  >
                                    {s.name}
                                  </Badge>
                                ))}
                                {t.schools.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    +{t.schools.length - 2} lainnya
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-3">
                            {t.timer_type === "per_category" ? (
                              <span className="text-muted-foreground italic text-xs">
                                Per Kategori
                              </span>
                            ) : (
                              <span className="font-mono">{t.total_time}s</span>
                            )}
                          </td>
                          <td className="p-3">
                            {t.status === true ? (
                              <Badge variant="success">Aktif</Badge>
                            ) : (
                              <Badge variant="destructive">Non-aktif</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1 justify-end">
                              <Link
                                href={`/cms/tryout/paket-latihan/${t.id}/questions-category`}
                              >
                                <ActionIcon label="Bank Soal">
                                  <ListChecks className="h-4 w-4" />
                                </ActionIcon>
                              </Link>

                              {t.score_type === "irt" && (
                                <Link
                                  href={`/cms/tryout/paket-latihan/${t.id}/irt`}
                                >
                                  <ActionIcon label="Penilaian IRT">
                                    <BarChart3 className="h-4 w-4" />
                                  </ActionIcon>
                                </Link>
                              )}

                              <Link href={`/cms/tryout/rank?test_id=${t.id}`}>
                                <ActionIcon label="Rank">
                                  <Trophy className="h-4 w-4" />
                                </ActionIcon>
                              </Link>

                              <ActionIcon
                                label="Monitoring Peserta"
                                onClick={() => {
                                  setMonitoringTest(t);
                                }}
                              >
                                <UsersIcon className="h-4 w-4" />
                              </ActionIcon>

                              <ActionIcon
                                label="Export"
                                onClick={() => onExport(t.id)}
                                disabled={exportingId === t.id}
                              >
                                <FileDown className="h-4 w-4" />
                              </ActionIcon>

                              <ActionIcon
                                label="Edit"
                                onClick={() => openEdit(t)}
                              >
                                <PenLine className="h-4 w-4" />
                              </ActionIcon>
                              <ActionIcon
                                label="Hapus"
                                onClick={() => onDelete(t.id, t.title)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </ActionIcon>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        className="p-8 text-center text-muted-foreground"
                        colSpan={10}
                      >
                        Tidak ada data yang cocok dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pager
              page={data?.current_page ?? 1}
              lastPage={data?.last_page ?? 1}
              onChange={setPage}
            />
          </CardContent>
        </Card>

        <Dialog
          open={open}
          modal={false}
          onOpenChange={(v) => {
            if (!v) setEditing(null);
            setOpen(v);
          }}
        >
          <DialogContent
            withOverlay={false}
            className="z-50 max-h-[98vh] overflow-y-auto sm:max-w-2xl md:max-w-3xl xl:max-w-5xl"
          >
            <DialogHeader>
              <DialogTitle>
                {editing ? "Form Ubah Try Out" : "Form Tambah Try Out"}
              </DialogTitle>
            </DialogHeader>

            <TryoutForm
              key={editing ? editing.id : "new"}
              // Removed initialSchools
              initial={
                editing
                  ? toForm(editing)
                  : !isSuperadmin && isPengawas
                  ? { ...emptyForm, user_id: myId }
                  : emptyForm
              }
              submitting={creating || updating}
              onCancel={() => {
                setOpen(false);
                setEditing(null);
              }}
              onSubmit={async (values) => {
                await onSubmit(values);
              }}
            />
          </DialogContent>
        </Dialog>

        <TryoutMonitoringDialog
          open={!!monitoringTest}
          onOpenChange={(v) => {
            if (!v) {
              setMonitoringTest(null);
            }
          }}
          test={
            monitoringTest
              ? { id: monitoringTest.id, title: monitoringTest.title }
              : null
          }
          isSuperadmin={isSuperadmin}
          myId={myId}
        />
      </div>
    </>
  );
}