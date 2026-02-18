"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function TryoutSessionError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-lg font-semibold text-zinc-800">
        Terjadi kesalahan saat memuat halaman ujian
      </h2>
      <p className="text-sm text-zinc-500">
        Silakan coba muat ulang halaman atau kembali ke daftar tryout.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
        <Button variant="outline" asChild>
          <Link href="/tryout">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>
    </div>
  );
}
