"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/services/users-management.service";
import { useGetRolesQuery } from "@/services/users.service";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { Combobox } from "@/components/ui/combo-box";
import type { Role } from "@/types/user";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  id?: number;
  defaultRoleId?: number;
  onClose: () => void;
  onSuccess: () => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  status: boolean;
};

export default function UsersForm({
  open,
  mode,
  id,
  defaultRoleId = 2,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = mode === "edit";

  const { data: detail, isFetching } = useGetUserByIdQuery(id ?? 0, {
    skip: !isEdit || !id,
  });

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  // ambil daftar role
  const {
    data: rolesResp,
    isLoading: loadingRoles,
    refetch: refetchRoles,
  } = useGetRolesQuery();

  // normalisasi respon role tanpa any
  const roles: Role[] = Array.isArray(rolesResp)
    ? rolesResp
    : Array.isArray((rolesResp as { data?: Role[] })?.data)
      ? ((rolesResp as { data?: Role[] }).data as Role[])
      : [];

  // 1. Helper Format (Visual)
  const formatPhoneDisplay = (value: string) => {
    const cleaned = value.replace(/\D/g, ""); // Hapus non-digit

    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    // Max digit display (misal 14 digit)
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 14)}`;
  };

  const initial: FormState = useMemo(
    () => ({
      name: detail?.name ?? "",
      email: detail?.email ?? "",
      // 2. Format data dari DB saat load awal (Edit Mode)
      phone: formatPhoneDisplay(detail?.phone ?? ""),
      password: "",
      password_confirmation: "",
      status: true,
    }),
    [detail],
  );

  const [form, setForm] = useState<FormState>(initial);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(
    defaultRoleId ?? null,
  );

  // kalau edit → isikan form dan role
  useEffect(() => {
    setForm(initial);
    if (isEdit && detail) {
      const firstRole =
        detail.roles && detail.roles.length > 0 ? detail.roles[0].id : null;
      setSelectedRoleId(firstRole);
    } else if (!isEdit) {
      setSelectedRoleId(defaultRoleId ?? null);
    }
  }, [initial, isEdit, detail, defaultRoleId]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) {
      await Swal.fire({ icon: "warning", title: "Nama wajib diisi" });
      return;
    }
    if (!form.email.trim()) {
      await Swal.fire({ icon: "warning", title: "Email wajib diisi" });
      return;
    }
    if (!selectedRoleId) {
      await Swal.fire({ icon: "warning", title: "Pilih role terlebih dahulu" });
      return;
    }
    if (!isEdit && !form.password) {
      await Swal.fire({ icon: "warning", title: "Password wajib diisi" });
      return;
    }
    if (!isEdit && form.password !== form.password_confirmation) {
      await Swal.fire({
        icon: "warning",
        title: "Konfirmasi password tidak sama",
      });
      return;
    }

    // 3. Bersihkan strip (-) sebelum kirim ke API
    const cleanPhone = form.phone.replace(/\D/g, "");
    const finalPhone = cleanPhone || null;

    try {
      if (isEdit && id) {
        await updateUser({
          id,
          payload: {
            name: form.name,
            email: form.email,
            phone: finalPhone, // Gunakan yang bersih
            status: form.status ? 1 : 0,
            role_id: selectedRoleId,
          },
        }).unwrap();
        await Swal.fire({ icon: "success", title: "User diperbarui" });
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          phone: finalPhone || "", // Gunakan yang bersih
          role_id: selectedRoleId,
          status: form.status ? 1 : 0,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }).unwrap();
        await Swal.fire({ icon: "success", title: "User dibuat" });
      }
      onSuccess();
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: isEdit ? "Gagal memperbarui" : "Gagal membuat",
        text: e instanceof Error ? e.message : "Terjadi kesalahan.",
      });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit User" : "Tambah User"}
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama</Label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@domain.com"
              />
            </div>

            {/* Input Phone Updated */}
            <div>
              <Label>Nomor HP</Label>
              <Input
                value={form.phone}
                onChange={(e) => {
                  // Format saat mengetik
                  const formatted = formatPhoneDisplay(e.target.value);
                  set("phone", formatted);
                }}
                placeholder="08xx-xxxx-xxxx"
                maxLength={16}
              />
            </div>
          </div>

          {/* pilih role */}
          <div>
            <Label>Role</Label>
            <Combobox<Role>
              value={selectedRoleId}
              onChange={(val) => setSelectedRoleId(val)}
              onOpenRefetch={() => {
                void refetchRoles();
              }}
              data={roles}
              isLoading={loadingRoles}
              placeholder="Pilih role pengguna"
              getOptionLabel={(r) => r.name}
            />
          </div>

          {!isEdit && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                />
              </div>
              <div>
                <Label>Konfirmasi Password</Label>
                <Input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => set("password_confirmation", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              id="status"
              type="checkbox"
              checked={form.status}
              onChange={(e) => set("status", e.target.checked)}
            />
            <Label htmlFor="status">Aktif</Label>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-sky-600 hover:bg-sky-700"
              disabled={creating || updating || (isEdit && isFetching)}
            >
              {isEdit ? "Simpan Perubahan" : "Buat User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}