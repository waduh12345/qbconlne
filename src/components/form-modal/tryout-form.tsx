"use client";

import { useState } from "react";
import { useCreateTestMutation } from "@/services/tryout/test.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SunRichText from "../ui/rich-text";

// Import tipe asli dari service/types agar sinkron
import { TestPayload } from "@/types/tryout/test";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

// Kita gunakan TestPayload sebagai basis tipe state form
// Omit field yang opsional atau di-handle secara khusus jika perlu, tapi
// untuk kasus ini, lebih baik kita ikuti struktur TestPayload agar kompatibel.
type FormState = TestPayload;

export default function TryoutForm({ open, onOpenChange, onSuccess }: Props) {
  const [modeTime, setModeTime] = useState<"default" | "custom">("default");

  // Inisialisasi state dengan semua field wajib dari TestPayload
  const [form, setForm] = useState<FormState>({
    title: "",
    sub_title: "",
    description: "",
    total_time: 0,
    pass_grade: 70,
    assessment_type: "irt",
    timer_type: "per_test",
    score_type: "default",
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    shuffle_questions: 0, // Default 0 (false)
    code: "",
    max_attempts: "1",
    is_graded: true,
    is_explanation_released: false,
    status: 1,

    // ✅ Tambahkan field wajib yang hilang sesuai error message
    school_id: [], // Array kosong default
    all_school: 0, // Default 0 (Manual)
    user_id: 0, // Default 0 atau ID user yang sedang login
    parent_id: null,
    tryout_id: null,
    // school_except_id juga opsional di interface, tapi sebaiknya diinisialisasi jika dipakai
    school_except_id: [],
  });

  const [createTest, { isLoading }] = useCreateTestMutation();

  // Helper update yang aman secara tipe
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    // Persiapkan payload final
    const payload: TestPayload = {
      ...form,
      total_time: modeTime === "default" ? 0 : Number(form.total_time || 0),
      // Pastikan format shuffle_questions sesuai (number 0/1)
      shuffle_questions: form.shuffle_questions ? 1 : 0,
      // Format tanggal: replace 'T' dengan spasi jika backend meminta 'YYYY-MM-DD HH:mm:ss'
      start_date: form.start_date ? form.start_date.replace("T", " ") : "",
      end_date: form.end_date ? form.end_date.replace("T", " ") : "",

      // Pastikan field array/null dikirim dengan benar
      school_id: form.school_id || [],
      parent_id: form.parent_id || null,
      tryout_id: form.tryout_id || null,
    };

    try {
      await createTest(payload).unwrap();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create test:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl xl:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Paket Try Out</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Title */}
          <div>
            <Label>Nama *</Label>
            <Input
              placeholder="Nama Paket"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          {/* Sub Title */}
          <div>
            <Label>Sub Title</Label>
            <Input
              placeholder="Sub Title"
              value={form.sub_title ?? ""}
              onChange={(e) => update("sub_title", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label>Deskripsi</Label>
            <SunRichText
              value={form.description ?? ""}
              onChange={(html) => update("description", html)}
              minHeight={150}
            />
          </div>

          {/* Timer Logic */}
          <div>
            <Label>Mode Waktu</Label>
            <Select
              value={modeTime}
              onValueChange={(v) => setModeTime(v as "default" | "custom")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  Default (Tanpa Batas/Ikut Kategori)
                </SelectItem>
                <SelectItem value="custom">Custom (Set Detik)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Waktu Pengerjaan (Detik)</Label>
            <Input
              type="number"
              min={0}
              value={form.total_time ?? 0}
              disabled={modeTime !== "custom"}
              onChange={(e) =>
                update("total_time", Number(e.target.value || 0))
              }
            />
          </div>

          {/* Dates */}
          <div>
            <Label>Tanggal Mulai</Label>
            <Input
              type="datetime-local"
              value={form.start_date?.replace(" ", "T") ?? ""}
              onChange={(e) => update("start_date", e.target.value)}
            />
          </div>
          <div>
            <Label>Tanggal Selesai</Label>
            <Input
              type="datetime-local"
              value={form.end_date?.replace(" ", "T") ?? ""}
              onChange={(e) => update("end_date", e.target.value)}
            />
          </div>

          {/* Configs */}
          <div>
            <Label>Metode Penilaian</Label>
            <Select
              value={form.assessment_type}
              onValueChange={(v) => update("assessment_type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irt">IRT</SelectItem>
                <SelectItem value="point">Point (Klasik)</SelectItem>
                {/* Tambahkan opsi lain sesuai enum AssessmentType */}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Shuffle Pertanyaan</Label>
            <Select
              value={form.shuffle_questions ? "yes" : "no"}
              onValueChange={(v) =>
                update("shuffle_questions", v === "yes" ? 1 : 0)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Ya</SelectItem>
                <SelectItem value="no">Tidak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Kode Akses (Opsional)</Label>
            <Input
              value={form.code ?? ""}
              onChange={(e) => update("code", e.target.value)}
            />
          </div>

          <div>
            <Label>Max Attempts</Label>
            <Input
              type="number"
              value={form.max_attempts ?? ""}
              onChange={(e) => update("max_attempts", e.target.value)}
            />
          </div>

          {/* Status Switch (Active/Inactive) */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Status Aktif</Label>
              <div className="text-xs text-muted-foreground">
                Apakah tes ini bisa diakses?
              </div>
            </div>
            <Switch
              checked={form.status === 1}
              onCheckedChange={(v) => update("status", v ? 1 : 0)}
            />
          </div>

          {/* Graded Switch */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Penilaian (Graded)</Label>
              <div className="text-xs text-muted-foreground">
                Hitung nilai akhir?
              </div>
            </div>
            <Switch
              checked={!!form.is_graded}
              onCheckedChange={(v) => update("is_graded", v)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={submit} disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}