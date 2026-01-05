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
import { Loader2, X } from "lucide-react";

import type { School } from "@/types/master/school";
import type { Users } from "@/types/user";
import { useGetSchoolListQuery } from "@/services/master/school.service";
import { useGetUsersListQuery } from "@/services/users-management.service";

/** === Shared enums (sinkron dgn service) === */
export type TimerType = "per_test" | "per_category";
export type ScoreType = "default" | "irt";
export type AssessmentType = string;

/** === Form shape === */
export type FormState = {
  school_id: number[]; // Array of school IDs
  title: string;
  sub_title: string;
  slug: string;
  description: string;
  total_time: number;
  total_questions: number;
  pass_grade: number;
  shuffle_questions: boolean | number;
  assessment_type: AssessmentType;
  timer_type: TimerType;
  score_type: ScoreType;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  code: string;
  max_attempts: string;
  is_graded: boolean;
  is_explanation_released: boolean;
  user_id: number; // pengawas
  status: number;
};

type Props = {
  initial: FormState;
  // ✅ PERBAIKAN: Menerima list sekolah awal agar nama sekolah bisa ditampilkan
  initialSchools?: School[];
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: FormState) => void | Promise<void>;
};

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

type ButtonList = (string | string[])[];

const defaultButtons: ButtonList = [
  ["undo", "redo"],
  ["bold", "italic", "underline", "strike", "removeFormat"],
  ["font", "fontSize"],
  ["fontColor", "hiliteColor"],
  ["align", "list", "lineHeight"],
  ["blockquote", "link", "image", "video", "table"],
  ["codeView", "fullScreen"],
];

/** Normalisasi ke YYYY-MM-DD */
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
  initialSchools = [], // Default kosong jika create baru
  submitting,
  onCancel,
  onSubmit,
}: Props) {
  const [form, setForm] = React.useState<FormState>(initial);
  const [newSchoolId, setNewSchoolId] = React.useState<number | null>(null);

  // Sekolah
  const [schoolSearch, setSchoolSearch] = React.useState<string>("");
  const { data: schoolListResp, isFetching: loadingSchools } =
    useGetSchoolListQuery(
      {
        page: 1,
        paginate: 30,
        search: schoolSearch,
        order: "asc",
        orderBy: "schools.name",
      },
      { refetchOnMountOrArgChange: true }
    );

  // ✅ PERBAIKAN: Gabungkan sekolah dari API dan sekolah dari initial (mode edit)
  // Ini memastikan nama sekolah tetap ada meskipun sekolah tsb tidak muncul di page 1 API list
  const allSchools = React.useMemo(() => {
    const fromApi = schoolListResp?.data ?? [];
    const fromInitial = initialSchools;

    // Gabungkan dan hilangkan duplikat berdasarkan ID
    const combined = [...fromApi];
    fromInitial.forEach((initialS) => {
      if (!combined.some((apiS) => apiS.id === initialS.id)) {
        combined.push(initialS);
      }
    });
    return combined;
  }, [schoolListResp, initialSchools]);

  // Sekolah yang belum dipilih (untuk combobox)
  const availableSchools = React.useMemo(() => {
    const schoolIds = Array.isArray(form.school_id) ? form.school_id : [];
    return allSchools.filter((s) => !schoolIds.includes(s.id));
  }, [allSchools, form.school_id]);

  // Map untuk mendapatkan nama sekolah dari ID
  const schoolMap = React.useMemo(() => {
    return new Map(allSchools.map((s) => [s.id, s.name]));
  }, [allSchools]);

  // Pengawas (role_id = 3)
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

  React.useEffect(() => {
    setForm(() => ({
      ...initial,
      start_date: dateOnly(initial.start_date),
      end_date: dateOnly(initial.end_date),
    }));
  }, [initial]);

  const validate = (): string | null => {
    if (!form.title.trim()) return "Judul wajib diisi.";
    if (form.school_id.length === 0)
      return "Sekolah wajib diisi (minimal satu).";
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
    await onSubmit(form);
  };

  const handleAddSchool = () => {
    if (newSchoolId) {
      setForm((prev) => ({
        ...prev,
        school_id: [
          ...new Set([
            ...(Array.isArray(prev.school_id) ? prev.school_id : []),
            newSchoolId,
          ]),
        ],
      }));
      setNewSchoolId(null);
    }
  };

  const handleRemoveSchool = (id: number) => {
    setForm((prev) => ({
      ...prev,
      school_id: prev.school_id.filter((sId) => sId !== id),
    }));
  };

  const handleRTChange = React.useCallback((html: string) => {
    setForm((prev) => ({ ...prev, description: html }));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Kiri */}
      <div className="space-y-3">
        {/* Sekolah (Multi-select) */}
        <div>
          <Label>Sekolah * (Bisa pilih lebih dari satu)</Label>
          <div className="h-2" />

          {/* List Sekolah yang Sudah Dipilih */}
          <div className="mb-3 flex flex-wrap gap-2 min-h-[38px] items-center rounded-md border p-2 bg-zinc-50">
            {form.school_id.length > 0 ? (
              form.school_id.map((id) => (
                <Badge
                  key={id}
                  variant="default"
                  className="bg-sky-500 hover:bg-sky-600"
                >
                  {schoolMap.get(id) ?? `ID:${id}`}
                  <button
                    type="button"
                    onClick={() => handleRemoveSchool(id)}
                    className="ml-1 rounded-full p-0.5 hover:bg-white/30 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-zinc-500">
                Belum ada sekolah dipilih.
              </span>
            )}
          </div>

          {/* Combobox untuk Menambah Sekolah Baru */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Combobox<School>
                value={newSchoolId}
                onChange={(value) => setNewSchoolId(value)}
                onSearchChange={setSchoolSearch}
                data={availableSchools}
                isLoading={loadingSchools}
                placeholder="Pilih Sekolah untuk ditambahkan"
                getOptionLabel={(s) => s.name}
              />
            </div>
            <button
              type="button"
              onClick={handleAddSchool}
              disabled={!newSchoolId}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Tambah
            </button>
          </div>
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

        {/* Timer Type & Score Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Timer Type</Label>
            <div className="h-2" />
            <Select
              value={form.timer_type}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  timer_type: v as TimerType,
                }))
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
                setForm((prev) => ({
                  ...prev,
                  score_type: v as ScoreType,
                }))
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
              {form.timer_type === "per_test"
                ? "*"
                : "(diabaikan saat per category)"}
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Access Code (opsional)</Label>
            <div className="h-2" />
            <Input
              value={form.code ?? ""}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div>
            <Label>Max Attempts (opsional)</Label>
            <div className="h-2" />
            <Input
              type="number"
              value={form.max_attempts ?? ""}
              onChange={(e) =>
                setForm({ ...form, max_attempts: e.target.value })
              }
            />
          </div>
        </div>

        {/* type="date", kirim selalu sebagai YYYY-MM-DD */}
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
              // Wajib jika Score Type = IRT
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
              // Wajib jika Score Type = IRT
              required={form.score_type === "irt"}
            />
          </div>
        </div>
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
        <div className="flex items-center gap-3 mt-4">
          <Switch
            checked={!!form.status}
            onCheckedChange={(v) => setForm({ ...form, status: v ? 1 : 0 })}
            id="status-switch"
          />
          <Label htmlFor="status-switch">Status aktif</Label>
        </div>
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