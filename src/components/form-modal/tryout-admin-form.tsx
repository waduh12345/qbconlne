"use client";

import * as React from "react";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X, School as SchoolIcon, Ban } from "lucide-react";

import type { School } from "@/types/master/school";
import type { Users } from "@/types/user";
import type { Test } from "@/types/tryout/test";

import { useGetSchoolListQuery } from "@/services/master/school.service";
import { useGetUsersListQuery } from "@/services/users-management.service";
import {
  useGetTestListQuery,
  useGetTestByIdQuery,
} from "@/services/tryout/test.service";
import { useGetTryoutListQuery } from "@/services/tryout/sub-tryout.service";

/** === Shared enums (sinkron dgn service) === */
export type TimerType = "per_test" | "per_category";
export type ScoreType = "default" | "irt";
export type AssessmentType = string;

/** === Form shape === */
export type FormState = {
  id?: number;
  school_id: number[];
  title: string;
  sub_title: string;
  slug: string;
  school_except_id: number[];
  all_school: number;
  description: string;
  total_time: number;
  total_questions: number;
  pass_grade: number;
  shuffle_questions: boolean | number;
  assessment_type: AssessmentType;
  timer_type: TimerType;
  score_type: ScoreType;
  start_date: string;
  end_date: string;
  code: string;
  max_attempts: string;
  is_graded: boolean;
  is_explanation_released: boolean;
  user_id: number;
  status: number;
  parent_id: number | null;
  tryout_id: number | null;
};

type Props = {
  initial: FormState;
  initialSchools?: School[];
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: FormState) => void | Promise<void>;
};

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const defaultButtons = [
  ["undo", "redo"],
  ["bold", "italic", "underline", "strike", "removeFormat"],
  ["font", "fontSize"],
  ["fontColor", "hiliteColor"],
  ["align", "list", "lineHeight"],
  ["blockquote", "link", "image", "video", "table"],
  ["codeView", "fullScreen"],
];

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

export default function TryoutForm({
  initial,
  submitting,
  onCancel,
  onSubmit,
}: Props) {
  // 1. Fetch Detail Data jika Mode Edit (initial.id ada)
  const { data: detailData, isFetching: loadingDetail } = useGetTestByIdQuery(
    initial.id!,
    { skip: !initial.id, refetchOnMountOrArgChange: true }
  );

  const [form, setForm] = React.useState<FormState>(initial);
  const [newSchoolId, setNewSchoolId] = React.useState<number | null>(null);
  const [newExceptId, setNewExceptId] = React.useState<number | null>(null);

  // --- Sync Form dengan Data Detail API (Mode Edit) ---
  React.useEffect(() => {
    if (detailData) {
      // Tidak menggunakan 'any', akses properti langsung dari interface Test
      // Pastikan interface Test sudah memiliki field school_excepts
      const schools = detailData.schools ?? [];
      const excepts = detailData.school_excepts ?? [];

      setForm((prev) => ({
        ...prev,
        title: detailData.title,
        sub_title: detailData.sub_title ?? "",
        slug: detailData.slug ?? "",
        description: detailData.description ?? "",
        total_time: detailData.total_time,
        total_questions: detailData.total_questions,
        pass_grade: detailData.pass_grade,
        shuffle_questions: detailData.shuffle_questions,
        assessment_type: detailData.assessment_type as AssessmentType,
        timer_type: detailData.timer_type as TimerType,
        score_type: (detailData.score_type as ScoreType) ?? "default",
        start_date: dateOnly(detailData.start_date),
        end_date: dateOnly(detailData.end_date),
        code: detailData.code ?? "",
        max_attempts: detailData.max_attempts ?? "",
        is_graded: detailData.is_graded,
        is_explanation_released: detailData.is_explanation_released,
        user_id: detailData.user_id ?? 0,
        status: detailData.status ? 1 : 0,
        parent_id: detailData.parent_id ?? null,
        tryout_id: detailData.tryout_id ?? null,

        // Logika Sekolah
        all_school: detailData.all_school ? 1 : 0,
        school_id: schools.map((s) => s.id),
        school_except_id: excepts.map((s) => s.id),
      }));
    } else {
      // Mode Create: Gunakan initial props
      if (!initial.id) {
        setForm((prev) => ({
          ...prev,
          ...initial,
          start_date: dateOnly(initial.start_date),
          end_date: dateOnly(initial.end_date),
        }));
      }
    }
  }, [detailData, initial]);

  // --- 2. Sekolah (Pencarian via API) ---
  const [schoolSearch, setSchoolSearch] = React.useState<string>("");
  const { data: schoolListResp, isFetching: loadingSchools } =
    useGetSchoolListQuery(
      {
        page: 1,
        paginate: 50,
        search: schoolSearch,
        order: "asc",
        orderBy: "schools.name",
      },
      { refetchOnMountOrArgChange: true }
    );

  // Menggabungkan data sekolah dari API pencarian dengan data sekolah yang sedang terpilih (dari detailData)
  // Ini penting agar badge sekolah tetap tampil namanya meskipun sekolah tersebut tidak ada di page 1 pencarian API.
  const allSchools = React.useMemo(() => {
    const fromApi = schoolListResp?.data ?? [];
    const combined = [...fromApi];

    if (detailData) {
      // Gabungkan schools (akses)
      if (detailData.schools) {
        detailData.schools.forEach((s) => {
          // Cek apakah sudah ada di list (by id)
          if (!combined.some((apiS) => apiS.id === s.id)) {
            // Karena tipe School di Test.schools dan School di API list sedikit beda struktur pivot-nya,
            // kita cast ke School atau ambil field yang relevan. Di sini kita asumsikan strukturnya kompatibel untuk id & name.
            combined.push(s as unknown as School);
          }
        });
      }
      // Gabungkan school_excepts (pengecualian)
      if (detailData.school_excepts) {
        detailData.school_excepts.forEach((s) => {
          if (!combined.some((apiS) => apiS.id === s.id)) {
            combined.push(s as unknown as School);
          }
        });
      }
    }
    return combined;
  }, [schoolListResp, detailData]);

  // Filter sekolah yang tersedia untuk input "Sekolah Akses" (belum dipilih)
  const availableSchools = React.useMemo(() => {
    const schoolIds = Array.isArray(form.school_id) ? form.school_id : [];
    return allSchools.filter((s) => !schoolIds.includes(s.id));
  }, [allSchools, form.school_id]);

  // Filter sekolah yang tersedia untuk input "Sekolah Pengecualian" (belum dipilih)
  const availableExceptSchools = React.useMemo(() => {
    const exceptIds = Array.isArray(form.school_except_id)
      ? form.school_except_id
      : [];
    return allSchools.filter((s) => !exceptIds.includes(s.id));
  }, [allSchools, form.school_except_id]);

  // Map untuk menampilkan nama sekolah di badge berdasarkan ID
  const schoolMap = React.useMemo(() => {
    return new Map(allSchools.map((s) => [s.id, s.name]));
  }, [allSchools]);

  // --- 3. Pengawas ---
  const [pengawasSearch, setPengawasSearch] = React.useState<string>("");
  const {
    data: pengawasResp,
    isFetching: loadingPengawas,
    refetch: refetchPengawas,
  } = useGetUsersListQuery(
    { page: 1, paginate: 30, search: pengawasSearch, role_id: 3 },
    { refetchOnMountOrArgChange: true }
  );
  const pengawasList: Users[] = pengawasResp?.data ?? [];

  const handlePengawasOpenRefetch = React.useCallback(() => {
    refetchPengawas();
  }, [refetchPengawas]);

  // --- 4. Parent Test (Kategori) ---
  const [parentSearch, setParentSearch] = React.useState<string>("");
  const {
    data: parentResp,
    isFetching: loadingParent,
    refetch: refetchParent,
  } = useGetTestListQuery(
    {
      page: 1,
      paginate: 30,
      search: parentSearch,
      isParent: 1,
    },
    { refetchOnMountOrArgChange: true }
  );
  const parentList: Test[] = parentResp?.data ?? [];

  // --- 5. Tryout ---
  const [tryoutSearch, setTryoutSearch] = React.useState<string>("");
  const {
    data: tryoutResp,
    isFetching: loadingTryout,
    refetch: refetchTryout,
  } = useGetTryoutListQuery(
    {
      page: 1,
      paginate: 30,
      search: tryoutSearch,
      status: 1,
    },
    { refetchOnMountOrArgChange: true }
  );
  const tryoutList = tryoutResp?.data ?? [];

  const validate = (): string | null => {
    if (!form.title.trim()) return "Judul wajib diisi.";

    // Validasi Manual: Wajib pilih minimal 1 sekolah
    if (form.all_school === 0 && form.school_id.length === 0)
      return "Pilih minimal satu sekolah jika mode Manual.";

    if (!form.user_id) return "Pengawas wajib dipilih.";

    if (
      form.timer_type === "per_test" &&
      (!form.total_time || form.total_time <= 0)
    ) {
      return "Total waktu wajib diisi dan > 0 saat Timer Type = Per Test.";
    }

    if (form.score_type === "irt") {
      if (!form.start_date || !form.end_date) {
        return "Tanggal mulai & selesai wajib diisi saat Score Type = IRT.";
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      void Swal.fire({ icon: "warning", title: err });
      return;
    }

    // Bersihkan data sebelum submit agar konsisten dengan pilihan user
    const payload = { ...form };
    if (payload.all_school === 1) {
      // Jika semua sekolah, list sekolah akses harus kosong (karena logika backend biasanya 'empty' school_id means all if all_school flag is true)
      // Namun untuk keamanan, kita kosongkan school_id manual
      payload.school_id = [];
    } else {
      // Jika manual, list pengecualian harus kosong
      payload.school_except_id = [];
    }

    await onSubmit(payload);
  };

  const handleAddSchool = () => {
    if (newSchoolId) {
      setForm((prev) => ({
        ...prev,
        school_id: [...new Set([...prev.school_id, newSchoolId])],
      }));
      setNewSchoolId(null);
    }
  };

  const handleAddExceptSchool = () => {
    if (newExceptId) {
      setForm((prev) => ({
        ...prev,
        school_except_id: [...new Set([...prev.school_except_id, newExceptId])],
      }));
      setNewExceptId(null);
    }
  };

  const handleRemoveSchool = (id: number) => {
    setForm((prev) => ({
      ...prev,
      school_id: prev.school_id.filter((sId) => sId !== id),
    }));
  };

  const handleRemoveExceptSchool = (id: number) => {
    setForm((prev) => ({
      ...prev,
      school_except_id: prev.school_except_id.filter((sId) => sId !== id),
    }));
  };

  const handleRTChange = React.useCallback((html: string) => {
    setForm((prev) => ({ ...prev, description: html }));
  }, []);

  // Tampilkan loading jika sedang fetch detail (hanya saat edit)
  if (initial.id && loadingDetail) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Kiri */}
      <div className="space-y-3">
        {/* Urutan 1: Kategori Tryout */}
        <div>
          <Label>Kategori Tryout</Label>
          <div className="h-2" />
          <Combobox
            value={form.tryout_id}
            onChange={(value) => setForm({ ...form, tryout_id: value })}
            onSearchChange={setTryoutSearch}
            onOpenRefetch={refetchTryout}
            data={tryoutList}
            isLoading={loadingTryout}
            placeholder="Pilih Kategori Tryout"
            getOptionLabel={(t) => t.title}
          />
        </div>

        {/* Urutan 2: Tryout Induk / Tryout Parent (Opsional) */}
        <div>
          <Label>Tryout Induk / Tryout Parent (Opsional)</Label>
          <div className="h-2" />
          <Combobox<Test>
            value={form.parent_id}
            onChange={(value) => {
              const selectedParent = parentList.find((p) => p.id === value);

              setForm((prev) => ({
                ...prev,
                parent_id: value,
                start_date: selectedParent
                  ? dateOnly(selectedParent.start_date)
                  : prev.start_date,
                end_date: selectedParent
                  ? dateOnly(selectedParent.end_date)
                  : prev.end_date,
                status: selectedParent
                  ? selectedParent.status
                    ? 1
                    : 0
                  : prev.status,
              }));
            }}
            onSearchChange={setParentSearch}
            onOpenRefetch={refetchParent}
            data={parentList}
            isLoading={loadingParent}
            placeholder="Pilih Induk Tes"
            getOptionLabel={(t) => t.title}
          />
        </div>

        {/* Urutan 3: Konfigurasi Sekolah (Semua Sekolah vs Manual) */}
        <div className="p-4 border rounded-lg bg-slate-50/50 space-y-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Cakupan Sekolah *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={form.all_school === 1 ? "default" : "outline"}
                className="flex-1"
                onClick={() => setForm({ ...form, all_school: 1 })}
              >
                Semua Sekolah
              </Button>
              <Button
                type="button"
                variant={form.all_school === 0 ? "default" : "outline"}
                className="flex-1"
                onClick={() => setForm({ ...form, all_school: 0 })}
              >
                Manual (Pilih)
              </Button>
            </div>
          </div>

          {/* Skenario 1: MANUAL (all_school === 0) */}
          {form.all_school === 0 && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <Label className="text-xs">
                Pilih Sekolah yang Dapat Mengakses
              </Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox<School>
                    value={newSchoolId}
                    onChange={(value) => setNewSchoolId(value)}
                    onSearchChange={setSchoolSearch}
                    data={availableSchools}
                    isLoading={loadingSchools}
                    placeholder="Tambah sekolah..."
                    getOptionLabel={(s) => s.name}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddSchool}
                  disabled={!newSchoolId}
                >
                  Tambah
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.school_id.map((id) => (
                  <Badge key={id} variant="default" className="bg-sky-500">
                    <SchoolIcon className="mr-1 h-3 w-3" />
                    {schoolMap.get(id) ?? id}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveSchool(id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skenario 2: SEMUA SEKOLAH (all_school === 1) */}
          {form.all_school === 1 && (
            <div className="pt-2 border-t animate-in fade-in duration-300">
              <Label className="text-xs text-destructive font-semibold">
                Pilih Sekolah Tidak Boleh Akses (Kecualikan)
              </Label>
              <div className="h-2" />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Combobox<School>
                    value={newExceptId}
                    onChange={(value) => setNewExceptId(value)}
                    onSearchChange={setSchoolSearch}
                    data={availableExceptSchools}
                    isLoading={loadingSchools}
                    placeholder="Kecualikan sekolah..."
                    getOptionLabel={(s) => s.name}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleAddExceptSchool}
                  disabled={!newExceptId}
                >
                  Tambah
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.school_except_id.map((id) => (
                  <Badge key={id} variant="destructive">
                    <Ban className="mr-1 h-3 w-3" />
                    {schoolMap.get(id) ?? id}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveExceptSchool(id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Label>Pengawas *</Label>
          <div className="h-2" />
          <Combobox<Users>
            value={form.user_id}
            onChange={(value) => setForm({ ...form, user_id: value })}
            onSearchChange={setPengawasSearch}
            onOpenRefetch={handlePengawasOpenRefetch}
            data={pengawasList}
            isLoading={loadingPengawas}
            placeholder="Pilih Pengawas"
            getOptionLabel={(u) => `${u.name} (${u.email})`}
          />
        </div>

        <div>
          <Label>Judul *</Label>
          <div className="h-2" />
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <Label>Sub Judul</Label>
          <div className="h-2" />
          <Input
            value={form.sub_title ?? ""}
            onChange={(e) => setForm({ ...form, sub_title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Timer Type</Label>
            <div className="h-2" />
            <Select
              value={form.timer_type}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, timer_type: v as TimerType }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih timer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per_test">Per Test</SelectItem>
                <SelectItem value="per_category">Per Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Score Type</Label>
            <div className="h-2" />
            <Select
              value={form.score_type}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, score_type: v as ScoreType }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih score type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="irt">IRT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>
              Total Time (detik){" "}
              {form.timer_type === "per_test" ? "*" : "(diabaikan)"}
            </Label>
            <div className="h-2" />
            <Input
              type="number"
              disabled={form.timer_type !== "per_test"}
              value={form.timer_type === "per_test" ? form.total_time : 0}
              onChange={(e) =>
                setForm({ ...form, total_time: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Switch
              checked={!!form.is_graded}
              onCheckedChange={(v) => setForm({ ...form, is_graded: v })}
              id="graded"
            />
            <Label htmlFor="graded">Status: Active (Graded)</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Pass Grade</Label>
            <div className="h-2" />
            <Input
              type="number"
              value={form.pass_grade}
              onChange={(e) =>
                setForm({ ...form, pass_grade: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Switch
              id="shuffle"
              checked={Boolean(form.shuffle_questions)}
              onCheckedChange={(v) =>
                setForm({ ...form, shuffle_questions: v })
              }
            />
            <Label htmlFor="shuffle">Shuffle Questions</Label>
          </div>
        </div>

        {!form.parent_id && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tanggal Mulai</Label>
              <div className="h-2" />
              <Input
                type="date"
                value={form.start_date || ""}
                onChange={(e) =>
                  setForm({ ...form, start_date: dateOnly(e.target.value) })
                }
                required={form.score_type === "irt"}
              />
            </div>
            <div>
              <Label>Tanggal Selesai</Label>
              <div className="h-2" />
              <Input
                type="date"
                value={form.end_date || ""}
                onChange={(e) =>
                  setForm({ ...form, end_date: dateOnly(e.target.value) })
                }
                required={form.score_type === "irt"}
              />
            </div>
          </div>
        )}
      </div>

      {/* Kanan: Rich Text */}
      <div className="space-y-1">
        <Label>Deskripsi (Rich Text)</Label>
        <div className="h-1" />
        <div className="rounded-lg border bg-background">
          <SunEditor
            setContents={form.description}
            onChange={handleRTChange}
            placeholder="Tulis konten di sini…"
            setDefaultStyle={`
              body { font-family: inherit; font-size: 14px; line-height: 1.7; color: hsl(var(--foreground)); background: transparent; }
              a { color: hsl(var(--primary)); text-decoration: underline; }
              table { border-collapse: collapse; width: 100%; }
              table, th, td { border: 1px solid hsl(var(--border)); }
              th, td { padding: 6px 10px; }
            `}
            setOptions={{
              minHeight: "320px",
              maxHeight: "60vh",
              charCounter: true,
              showPathLabel: false,
              resizingBar: true,
              buttonList: defaultButtons,
            }}
          />
        </div>
        {!form.parent_id && (
          <div className="flex items-center gap-3 mt-4">
            <Switch
              checked={!!form.status}
              onCheckedChange={(v) => setForm({ ...form, status: v ? 1 : 0 })}
              id="status-switch"
            />
            <Label htmlFor="status-switch">Status aktif</Label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="md:col-span-2 flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan
        </Button>
      </div>
    </div>
  );
}