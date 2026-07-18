"use client";

import * as React from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import type { KampusPayload } from "@/types/master/kampus";

import {
  useCreateKampusMutation,
  useGetKampusByIdQuery,
  useUpdateKampusMutation,
} from "@/services/master/kampus.service";

type Mode = "create" | "update";

interface KampusFormProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (mode: Mode) => void;
  kampusId?: number;
}

export default function KampusForm({
  open,
  onOpenChange,
  onSuccess,
  kampusId,
}: KampusFormProps) {
  const isEdit = typeof kampusId === "number";

  const { data: detail, isFetching: loadingDetail } = useGetKampusByIdQuery(
    kampusId as number,
    { skip: !isEdit }
  );

  const [namaKampus, setNamaKampus] = React.useState<string>("");
  const [prodi, setProdi] = React.useState<string>("");
  const [nilai, setNilai] = React.useState<string>("");
  const [status, setStatus] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (detail && isEdit) {
      setNamaKampus(detail.nama_kampus ?? "");
      setProdi(detail.prodi ?? "");
      setNilai(detail.nilai !== null ? String(detail.nilai) : "");
      setStatus(Boolean(detail.status));
    }
  }, [detail, isEdit]);

  React.useEffect(() => {
    if (open && !isEdit) {
      setNamaKampus("");
      setProdi("");
      setNilai("");
      setStatus(true);
    }
  }, [open, isEdit]);

  const [createKampus, { isLoading: creating }] = useCreateKampusMutation();
  const [updateKampus, { isLoading: updating }] = useUpdateKampusMutation();
  const submitting = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKampus.trim()) {
      void Swal.fire({ icon: "warning", title: "Nama Kampus wajib diisi" });
      return;
    }

    // Parse nilai: terima "3,75" maupun "3.75"
    let parsedNilai: number | null = null;
    if (nilai.trim()) {
      const normalized = nilai.replace(",", ".").trim();
      const n = Number(normalized);
      if (!Number.isFinite(n)) {
        void Swal.fire({
          icon: "warning",
          title: "Nilai tidak valid",
          text: "Masukkan angka, contoh: 3.75",
        });
        return;
      }
      parsedNilai = n;
    }

    const payload: KampusPayload = {
      nama_kampus: namaKampus.trim(),
      prodi: prodi.trim() || null,
      nilai: parsedNilai,
      status,
    };

    try {
      if (isEdit) {
        await updateKampus({ id: kampusId as number, payload }).unwrap();
        onSuccess("update");
      } else {
        await createKampus(payload).unwrap();
        onSuccess("create");
      }
      onOpenChange(false);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Terjadi kesalahan. Coba lagi.";
      void Swal.fire({
        icon: "error",
        title: "Gagal menyimpan",
        text: message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Kampus" : "Tambah Kampus"}
          </DialogTitle>
        </DialogHeader>

        {loadingDetail && isEdit ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Memuat data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Kampus</Label>
              <Input
                value={namaKampus}
                onChange={(e) => setNamaKampus(e.target.value)}
                placeholder="cth: Universitas Indonesia"
              />
            </div>

            <div className="space-y-2">
              <Label>Prodi</Label>
              <Input
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                placeholder="cth: Teknik Informatika"
              />
            </div>

            <div className="space-y-2">
              <Label>Nilai</Label>
              <Input
                type="number"
                step="0.01"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="cth: 3.75"
              />
              <p className="text-xs text-muted-foreground">
                Mendukung desimal. Pemisah titik atau koma.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-xs text-muted-foreground">
                  Aktif/nonaktifkan kampus
                </div>
              </div>
              <Switch checked={status} onCheckedChange={setStatus} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEdit ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
