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

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

// Kita bisa extend dari TestPayload asli atau definisikan ulang yang kompatibel
// Di sini saya sesuaikan agar kompatibel dengan error message kamu
type TestCreatePayload = {
  title: string;
  sub_title: string;
  description: string | null;
  total_time: number;
  pass_grade: number;
  assessment_type: string;
  timer_type: string;
  score_type: string;
  start_date: string;
  end_date: string;
  shuffle_questions: boolean | number;
  code: string | null;
  max_attempts: string | null;
  is_graded: boolean;
  is_explanation_released: boolean;
  status: number; // ✅ Tambahkan ini (number, 1=active, 0=inactive)
};

export default function TryoutForm({ open, onOpenChange, onSuccess }: Props) {
  const [modeTime, setModeTime] = useState<"default" | "custom">("default");

  const [form, setForm] = useState<TestCreatePayload>({
    title: "",
    sub_title: "",
    description: "",
    total_time: 0,
    pass_grade: 70,
    assessment_type: "irt",
    timer_type: "per_test", // Sesuaikan default value dgn enum di backend (misal: per_test)
    score_type: "default", // Sesuaikan default value
    start_date: new Date().toISOString().slice(0, 16), // Format YYYY-MM-DDTHH:mm untuk input datetime-local
    end_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    shuffle_questions: false,
    code: "",
    max_attempts: "1",
    is_graded: true,
    is_explanation_released: false,
    status: 1, // ✅ Default status active
  });

  const [createTest, { isLoading }] = useCreateTestMutation();

  const update = <K extends keyof TestCreatePayload>(
    k: K,
    v: TestCreatePayload[K]
  ) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async () => {
    // Pastikan payload sesuai dengan TestPayload di service
    // Casting 'as any' atau 'as TestPayload' bisa jadi solusi cepat jika tipe sedikit berbeda (misal string vs enum)
    // Tapi sebaiknya sesuaikan strukturnya.

    const payload = {
      ...form,
      total_time: modeTime === "default" ? 0 : Number(form.total_time || 0),
      // Pastikan field lain konversinya benar
      shuffle_questions: form.shuffle_questions ? 1 : 0, // Backend kadang minta 1/0
      // Jika backend minta string tanggal format tertentu (YYYY-MM-DD HH:mm:ss), lakukan format di sini
      start_date: form.start_date.replace("T", " "),
      end_date: form.end_date.replace("T", " "),
    };

    try {
      await createTest(payload).unwrap();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create test:", error);
      // Handle error (e.g. toast)
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
              value={form.sub_title}
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
              value={form.total_time}
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
              value={form.start_date}
              onChange={(e) => update("start_date", e.target.value)}
            />
          </div>
          <div>
            <Label>Tanggal Selesai</Label>
            <Input
              type="datetime-local"
              value={form.end_date}
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
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Shuffle Pertanyaan</Label>
            <Select
              value={form.shuffle_questions ? "yes" : "no"}
              onValueChange={(v) => update("shuffle_questions", v === "yes")}
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
              checked={form.is_graded}
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