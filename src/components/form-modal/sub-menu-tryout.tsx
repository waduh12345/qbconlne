"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { Loader2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Pastikan import path ini benar
import {
  Tryout,
  TryoutPayload,
  useCreateTryoutMutation,
  useUpdateTryoutMutation,
} from "@/services/tryout/sub-tryout.service";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const toInputDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return dateStr.substring(0, 16).replace(" ", "T");
};

const toApiDate = (dateStr: string) => {
  return dateStr.replace("T", " ");
};

// ✅ Export interface ini agar bisa di-hover/dicek di parent, meski tidak wajib diimport
export interface TryoutFormProps {
  initialData?: Tryout | null;
  // Menerima fungsi biasa (v: boolean) => void ATAU Dispatch SetStateAction
  onOpenChange: ((open: boolean) => void) | Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

export default function TryoutForm({
  initialData,
  onOpenChange,
  onSuccess,
}: TryoutFormProps) {
  const isEdit = !!initialData;

  const [createTryout, { isLoading: isCreating }] = useCreateTryoutMutation();
  const [updateTryout, { isLoading: isUpdating }] = useUpdateTryoutMutation();
  const isLoading = isCreating || isUpdating;

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubTitle(initialData.sub_title ?? "");
      setStartDate(toInputDate(initialData.start_date));
      setEndDate(toInputDate(initialData.end_date));
      setDescription(initialData.description ?? "");
      setStatus(initialData.status);
    } else {
      setTitle("");
      setSubTitle("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setStatus(true);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      Swal.fire("Validasi Gagal", "Judul dan Tanggal wajib diisi.", "warning");
      return;
    }

    const payload: TryoutPayload = {
      title,
      sub_title: subTitle || null,
      start_date: toApiDate(startDate),
      end_date: toApiDate(endDate),
      description: description || null,
      status: status ? 1 : 0,
    };

    try {
      if (isEdit && initialData) {
        await updateTryout({ id: initialData.id, payload }).unwrap();
      } else {
        await createTryout(payload).unwrap();
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Data Tryout berhasil ${isEdit ? "diperbarui" : "dibuat"}.`,
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message || "Terjadi kesalahan saat menyimpan.";
      Swal.fire("Gagal", msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-1">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">
            Judul Tryout <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Contoh: Tryout Akbar 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sub_title">Sub Judul</Label>
          <Input
            id="sub_title"
            placeholder="Contoh: Batch 1"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start_date">
              Tanggal Mulai <span className="text-red-500">*</span>
            </Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="end_date">
              Tanggal Selesai <span className="text-red-500">*</span>
            </Label>
            <Input
              id="end_date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Deskripsi</Label>
          <div className="rounded-md border bg-white">
            <SunEditor
              setContents={description}
              onChange={setDescription}
              setOptions={{
                height: "150px",
                buttonList: [
                  ["bold", "italic", "underline", "strike"],
                  ["list", "align"],
                  ["fontColor", "hiliteColor"],
                  ["removeFormat"],
                ],
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/20">
          <Switch
            id="status"
            checked={status}
            onCheckedChange={setStatus}
            disabled={isLoading}
          />
          <Label htmlFor="status" className="cursor-pointer">
            Status Aktif ({status ? "Ya" : "Tidak"})
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" /> Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEdit ? "Simpan Perubahan" : "Buat Tryout"}
        </Button>
      </div>
    </form>
  );
}