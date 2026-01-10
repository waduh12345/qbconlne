"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import {
  Tryout,
  useGetTryoutListQuery,
  useDeleteTryoutMutation,
} from "@/services/tryout/sub-tryout.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SiteHeader } from "@/components/site-header";
import TryoutForm from "@/components/form-modal/sub-menu-tryout";

// Helper format tanggal singkat
const formatDate = (isoStr: string) => {
  if (!isoStr) return "-";
  return new Date(isoStr).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TryoutPage() {
  const [page, setPage] = useState(1);
  const [paginate] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Tryout | null>(null);

  useMemo(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching, refetch } = useGetTryoutListQuery({
    page,
    paginate,
    search: debouncedSearch,
    orderBy: "created_at",
    orderDirection: "desc",
  });

  const [deleteTryout, { isLoading: isDeleting }] = useDeleteTryoutMutation();

  const rows = data?.data ?? [];
  const meta = {
    current_page: data?.current_page ?? 1,
    last_page: data?.last_page ?? 1,
    total: data?.total ?? 0,
    from: (data?.current_page ?? 1 - 1) * paginate + 1,
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Tryout) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Tryout) => {
    const result = await Swal.fire({
      title: "Hapus Tryout?",
      text: `Anda akan menghapus "${item.title}". Data tidak dapat dikembalikan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteTryout(item.id).unwrap();
        Swal.fire("Terhapus!", "Data tryout telah dihapus.", "success");
        refetch();
      } catch (error) {
        console.error(error);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  return (
    <>
      <SiteHeader title="Manajemen Tryout" />

      <main className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 w-full">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari judul tryout..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </Button>
              <Button onClick={handleCreate} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Tambah Baru
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Informasi Tryout</TableHead>
                    <TableHead>Jadwal Pelaksanaan</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Tidak ada data tryout ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {(meta.current_page - 1) * paginate + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-base">
                            {row.title}
                          </div>
                          {row.sub_title && (
                            <div className="text-sm text-muted-foreground">
                              {row.sub_title}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm text-muted-foreground gap-1">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              Mulai: {formatDate(row.start_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              Selesai: {formatDate(row.end_date)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.status ? (
                            <Badge className="bg-green-600 hover:bg-green-700">
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Tidak Aktif</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(row)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(row)}
                              disabled={isDeleting}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Total {meta.total} data
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isFetching}
                >
                  Previous
                </Button>
                <div className="flex items-center px-2 text-sm font-medium">
                  Page {meta.current_page} of {meta.last_page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(meta.last_page, p + 1))
                  }
                  disabled={page >= meta.last_page || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedItem ? "Edit Tryout" : "Buat Tryout Baru"}
              </DialogTitle>
            </DialogHeader>
            <TryoutForm
              initialData={selectedItem}
              onOpenChange={setIsModalOpen}
              onSuccess={() => refetch()}
            />
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}