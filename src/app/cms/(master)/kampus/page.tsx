"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  Building2,
  Pencil,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  FileDown,
  Upload,
  Loader2,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { displayDate } from "@/lib/format-utils";
import type { Kampus } from "@/types/master/kampus";

import {
  useGetKampusListQuery,
  useDeleteKampusMutation,
  useExportKampusMutation,
  useImportKampusMutation,
} from "@/services/master/kampus.service";

import KampusForm from "@/components/form-modal/master/kampus-form";

export default function KampusPage() {
  const [page, setPage] = useState(1);
  const [paginate, setPaginate] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Kampus | null>(null);

  // export modal
  const [openExport, setOpenExport] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [exportSearch, setExportSearch] = useState<string>("");

  // import file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const {
    data: listResp,
    isFetching,
    refetch,
  } = useGetKampusListQuery(
    { page, paginate, search },
    { refetchOnMountOrArgChange: true }
  );

  const rows: Kampus[] = listResp?.data ?? [];
  const total = listResp?.total ?? 0;
  const currentPage = listResp?.current_page ?? 1;
  const lastPage = listResp?.last_page ?? 1;

  const start = rows.length ? (currentPage - 1) * paginate + 1 : 0;
  const end = rows.length ? (currentPage - 1) * paginate + rows.length : 0;

  const [remove, { isLoading: deleting }] = useDeleteKampusMutation();
  const [exportKampus, { isLoading: exporting }] = useExportKampusMutation();
  const [importKampus, { isLoading: importing }] = useImportKampusMutation();

  const onCreate = () => {
    setEditId(null);
    setOpenForm(true);
  };
  const onEdit = (id: number) => {
    setEditId(id);
    setOpenForm(true);
  };

  const alertSuccess = (title: string, text?: string) => {
    void Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title,
      text,
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      backdrop: false,
    });
  };

  const onSaved = (mode: "create" | "update") => {
    setOpenForm(false);
    setEditId(null);
    refetch();
    alertSuccess(
      mode === "create" ? "Berhasil Dibuat" : "Berhasil Diperbarui",
      mode === "create"
        ? "Kampus berhasil ditambahkan."
        : "Perubahan telah disimpan."
    );
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const name = pendingDelete.nama_kampus;
      await remove(pendingDelete.id).unwrap();
      setPendingDelete(null);
      refetch();
      alertSuccess("Berhasil Dihapus", `Kampus "${name}" telah dihapus.`);
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Terjadi kesalahan saat menghapus.";
      void Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: message,
      });
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportKampus({
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        search: exportSearch || undefined,
      }).unwrap();
      setOpenExport(false);
      void Swal.fire({
        icon: "info",
        title: "Export Diproses",
        text:
          res.data ??
          "Anda akan menerima notifikasi saat file siap diunduh.",
      });
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Tidak dapat memulai export.";
      void Swal.fire({
        icon: "error",
        title: "Gagal Export",
        text: message,
      });
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const res = await importKampus({ file }).unwrap();
      void Swal.fire({
        icon: "info",
        title: "Import Diproses",
        text:
          res.data ??
          "Proses import berjalan di background. Anda akan menerima notifikasi saat selesai.",
      });
      // reset input agar bisa pilih file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = "";
      // refresh list (data akan masuk bertahap; user bisa refetch lagi nanti)
      refetch();
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "File gagal diimpor.";
      void Swal.fire({
        icon: "error",
        title: "Gagal Import",
        text: message,
      });
    }
  };

  return (
    <>
      <SiteHeader title="Kampus" />
      <main className="space-y-6 px-4 py-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="gap-3 md:flex md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold tracking-tight">
                Kampus
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>

              {/* Import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleImportFile(f);
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="gap-2"
              >
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                onClick={() => setOpenExport(true)}
                disabled={exporting}
                className="gap-2"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Export
              </Button>

              <Button onClick={onCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Cari nama kampus / prodi…"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="sm:ml-auto">
                <Select
                  value={String(paginate)}
                  onValueChange={(v) => {
                    setPaginate(Number(v));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Per halaman" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} / halaman
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-background">
              <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                  <TableHeader className="sticky top-0 z-10 bg-muted/40 backdrop-blur supports-[backdrop-filter]:bg-muted/60">
                    <TableRow>
                      <TableHead className="w-[260px]">Nama Kampus</TableHead>
                      <TableHead>Prodi</TableHead>
                      <TableHead className="w-[120px]">Nilai</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[160px]">Dibuat</TableHead>
                      <TableHead className="text-right w-[120px]">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isFetching && rows.length === 0 && (
                      <>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i} className="hover:bg-transparent">
                            <TableCell>
                              <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {!isFetching && rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-28 text-center">
                          <p className="text-sm text-muted-foreground">
                            Tidak ada data.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}

                    {rows.map((r, idx) => (
                      <TableRow
                        key={r.id}
                        className={idx % 2 === 1 ? "bg-muted/20" : undefined}
                      >
                        <TableCell className="font-medium">
                          {r.nama_kampus}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {r.prodi ?? "-"}
                        </TableCell>
                        <TableCell className="font-medium tabular-nums">
                          {r.nilai !== null ? r.nilai : "-"}
                        </TableCell>
                        <TableCell>
                          {r.status ? (
                            <Badge className="gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <XCircle className="h-3.5 w-3.5" />
                              Nonaktif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{displayDate(r.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => onEdit(r.id)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => setPendingDelete(r)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3">
                <div className="text-xs text-muted-foreground">
                  Menampilkan <span className="font-medium">{start || 0}</span>–
                  <span className="font-medium">{end || 0}</span> dari{" "}
                  <span className="font-medium">{total}</span> data
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <div className="rounded-md border px-3 py-1 text-sm">
                    {currentPage} / {lastPage}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Create/Edit */}
        <KampusForm
          open={openForm}
          onOpenChange={(v) => {
            setOpenForm(v);
            if (!v) setEditId(null);
          }}
          onSuccess={onSaved}
          kampusId={editId ?? undefined}
        />

        {/* Confirm Delete */}
        <AlertDialog
          open={!!pendingDelete}
          onOpenChange={(o) => !o && setPendingDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kampus?</AlertDialogTitle>
              <AlertDialogDescription>
                Aksi ini tidak bisa dibatalkan. Item:
                <span className="font-semibold">
                  {" "}
                  {pendingDelete?.nama_kampus}
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Export Modal */}
        <Dialog open={openExport} onOpenChange={setOpenExport}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Export Kampus ke Excel</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tanggal Akhir</Label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Pencarian (opsional)</Label>
                <Input
                  placeholder="cth: Indonesia"
                  value={exportSearch}
                  onChange={(e) => setExportSearch(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Proses berjalan di background. Anda akan menerima notifikasi
                saat file siap diunduh.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenExport(false)}>
                Batal
              </Button>
              <Button
                onClick={handleExport}
                disabled={exporting}
                className="gap-2"
              >
                {exporting && <Loader2 className="h-4 w-4 animate-spin" />}
                <FileDown className="h-4 w-4" />
                Mulai Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
