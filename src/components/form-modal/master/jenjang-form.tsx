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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import type { JenjangPayload } from "@/types/master/jenjang";

import {
  useCreateJenjangMutation,
  useGetJenjangByIdQuery,
  useUpdateJenjangMutation,
} from "@/services/master/jenjang.service";

type Mode = "create" | "update";

interface JenjangFormProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (mode: Mode) => void;
  jenjangId?: number;
}

export default function JenjangForm({
  open,
  onOpenChange,
  onSuccess,
  jenjangId,
}: JenjangFormProps) {
  const isEdit = typeof jenjangId === "number";

  const { data: detail, isFetching: loadingDetail } = useGetJenjangByIdQuery(
    jenjangId as number,
    { skip: !isEdit }
  );

  const [name, setName] = React.useState<string>("");
  const [value, setValue] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [status, setStatus] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (detail && isEdit) {
      setName(detail.name ?? "");
      setValue(detail.value ?? "");
      setDescription(detail.description ?? "");
      setStatus(Boolean(detail.status));
    }
  }, [detail, isEdit]);

  React.useEffect(() => {
    if (open && !isEdit) {
      setName("");
      setValue("");
      setDescription("");
      setStatus(true);
    }
  }, [open, isEdit]);

  const [createJenjang, { isLoading: creating }] = useCreateJenjangMutation();
  const [updateJenjang, { isLoading: updating }] = useUpdateJenjangMutation();
  const submitting = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      void Swal.fire({ icon: "warning", title: "Nama wajib diisi" });
      return;
    }

    const payload: JenjangPayload = {
      name: name.trim(),
      value: value.trim() || null,
      description: description.trim() || null,
      status,
    };

    try {
      if (isEdit) {
        await updateJenjang({ id: jenjangId as number, payload }).unwrap();
        onSuccess("update");
      } else {
        await createJenjang(payload).unwrap();
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
            {isEdit ? "Edit Jenjang" : "Tambah Jenjang"}
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
              <Label>Nama Jenjang</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: SMA"
              />
            </div>

            <div className="space-y-2">
              <Label>Daftar Kelas / Value</Label>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="cth: X, XI, XII"
              />
              <p className="text-xs text-muted-foreground">
                Pisahkan dengan koma.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Keterangan jenjang (opsional)"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-xs text-muted-foreground">
                  Aktif/nonaktifkan jenjang
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
