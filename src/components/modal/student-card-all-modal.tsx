"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IdCard, Printer, Users } from "lucide-react";

import {
  CARD_STYLES,
  type StudentLite,
} from "@/components/modal/student-card-modal";

/** Utility untuk chunk array jadi per 8 item */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/** CSS preview (modal) - keep preview unchanged but reduce kv gap */
const CARD_ALL_STYLES = `
${CARD_STYLES}

/* Preview in modal */
.multi-card-preview-scale { transform: scale(1); transform-origin: top left; display:inline-block; }
.multi-card-preview-wrapper { display:inline-block; }

/* tighten kv spacing a bit for preview too */
.student-card-kv { display: grid; grid-template-columns: 120px minmax(0,1fr); gap: 0; margin: 0; }
`;

/** Build inner HTML kartu (sama dengan StudentCardModal) */
function buildCardInnerHTML(student: StudentLite): string {
  const nim = String(student?.nim ?? "—");
  const name = student?.name ?? "—";
  const kelas = student?.class_name ?? "—";
  const prodi = student?.school_name ?? "—";
  const sesi = student?.session ?? "—";
  const ruang = student?.room ?? "—";
  const pwd = student?.password ?? "—";

  return `
  <div class="student-card-root">
    <div class="student-card-inner">
      <div class="student-card-header">
        <div class="student-card-header-left">
          <div class="student-card-logo">EDU</div>
          <div class="student-card-school-block">
            <div class="student-card-school-name">${
              prodi !== "—" ? prodi : "NAMA SEKOLAH"
            }</div>
            <div class="student-card-exam-name">KARTU PESERTA SUMATIF AKHIR TAHUN</div>
            <div class="student-card-exam-year">Tahun Pelajaran 2023/2024</div>
          </div>
        </div>
        <div class="student-card-header-right">
          <div class="student-card-exam-tag">
            <span class="student-card-exam-tag-dot"></span>
            <span>RESMI • UJIAN SEKOLAH</span>
          </div>
        </div>
        <div class="student-card-header-watermark"></div>
      </div>

      <div class="student-card-body">
        <div class="student-card-box">
          <div class="student-card-row">
            <div class="student-card-col-main">
              <div class="student-card-divider"></div>
              <div class="student-card-kv">
                <div class="student-card-k">Nama Peserta</div>
                <div class="student-card-v">${name}</div>
              </div>
              <div class="student-card-kv">
                <div class="student-card-k">NISN / NIS</div>
                <div class="student-card-v">${nim}</div>
              </div>
              <div class="student-card-kv">
                <div class="student-card-k">Password Ujian</div>
                <div class="student-card-v">${pwd}</div>
              </div>
              <div class="student-card-kv">
                <div class="student-card-k">Kelas</div>
                <div class="student-card-v">${kelas}</div>
              </div>
              <div class="student-card-kv">
                <div class="student-card-k">Sesi / Ruang</div>
                <div class="student-card-v">${sesi} / ${ruang}</div>
              </div>
              <div class="student-card-kv">
                <div class="student-card-k">Program / Sekolah</div>
                <div class="student-card-v">${prodi}</div>
              </div>
            </div>

            <div class="student-card-col-side">
              <div class="student-card-photo-frame">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10L12 15 2 10l10-5 10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                <div class="student-card-photo-overlay-label">Foto 3x4</div>
              </div>
              <div class="student-card-idchip"><span>No. Peserta <strong>${nim}</strong></span></div>
            </div>
          </div>

          <div class="student-card-badge-bottom">
            <div class="student-card-badge-inner">
              <span class="student-card-badge-dot"></span>
              <span>Kartu Peserta • ${nim}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="student-card-footer">
        <div class="student-card-note">
          Harap kartu ini dibawa dan ditunjukkan kepada pengawas pada saat ujian berlangsung.
          Kartu berlaku untuk seluruh rangkaian ujian pada Tahun Pelajaran 2023/2024.
        </div>
        <div class="student-card-signature">
          <div class="student-card-signature-label">Peserta Ujian</div>
          <div class="student-card-signature-line"></div>
        </div>
      </div>
    </div>
  </div>
`;
}

/**
 * Build print HTML:
 * - ensure 2 columns x 4 rows (8 per page) by scaling using both width and height constraints
 * - aggressively reduce internal spacings for print via overrides
 */
function buildPrintHTML(students: StudentLite[]): string {
  const pages = chunkArray(students, 8);

  // target card base size: we assume original design ~720x420 (width x height).
  // we'll use these to compute scale for both axes.
  const BASE_DESIGN_WIDTH = 720; // original width baseline
  const BASE_DESIGN_HEIGHT = 420; // estimated original height baseline

  // smaller width to allow better fit
  const CARD_BASE_WIDTH = 530; // px (reduced)
  const CARD_BASE_HEIGHT = Math.round(
    (BASE_DESIGN_HEIGHT * CARD_BASE_WIDTH) / BASE_DESIGN_WIDTH
  );

  // page paddings
  const PAGE_PADDING_MM = 1.5; // reduce margin (mm)
  const printableWidthPx = ((210 - PAGE_PADDING_MM * 2) * 96) / 25.4;
  const printableHeightPx = ((297 - PAGE_PADDING_MM * 2) * 96) / 25.4;

  // available per card target
  const targetWidthPerCard = printableWidthPx / 2; // two columns
  const targetHeightPerCard = printableHeightPx / 4; // four rows

  const scaleWidth = targetWidthPerCard / CARD_BASE_WIDTH;
  const scaleHeight = targetHeightPerCard / CARD_BASE_HEIGHT;

  // choose the smaller scale so both width and height fit; cap at 1
  const SCALE = Math.min(1, scaleWidth, scaleHeight);

  // zero gap to maximize space
  const GAP_PX = 0;

  const pagesHTML = pages
    .map(
      (pageStudents) => `
    <section class="print-page">
      ${pageStudents
        .map(
          (s) => `
        <div class="print-card-slot">
          <div class="print-card-scale-wrapper" data-id="${s.id}">
            ${buildCardInnerHTML(s)}
          </div>
        </div>
      `
        )
        .join("")}
    </section>
  `
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Kartu Peserta</title>
<style>
  @page { size: A4; margin: ${PAGE_PADDING_MM}mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html,body { margin:0; padding:0; background: #ffffff; }
  body { padding: 0; min-height: 100vh; font-family: sans-serif; }

  ${CARD_STYLES}

  /* --- PRINT OVERRIDES: reduce spacing, font-sizes, margins --- */
  .student-card-root { page-break-inside: avoid; margin: 0 !important; }
  .student-card-inner { padding: 8px !important; }
  .student-card-header { padding: 4px 0 !important; }
  .student-card-school-name { font-size: 9px !important; line-height: 1 !important; }
  .student-card-exam-name { font-size: 8px !important; line-height: 1 !important; }
  .student-card-exam-year { font-size: 8px !important; }
  .student-card-k { font-size: 9px !important; padding: 0 0 2px 0 !important; }
  .student-card-v { font-size: 10px !important; }
  .student-card-photo-frame { width: 48px !important; height: 64px !important; }
  .student-card-note { font-size: 8px !important; margin-top: 6px !important; }
  .student-card-badge-bottom { margin-top: 4px !important; }
  .student-card-signature-line { height: 10px !important; }
  .student-card-col-side { padding-left: 6px !important; }
  .student-card-divider { margin: 4px 0 !important; }

  /* ensure no shadows or extra borders eat space */
  .student-card-root { box-shadow: none !important; border-radius: 2px !important; }

  .print-root { width: 100%; }

  .print-page {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    align-items: start;
    justify-items: center;
    gap: ${GAP_PX}px;
    page-break-after: always;
  }
  .print-page:last-child { page-break-after: auto; }

  .print-card-slot {
    display:flex;
    align-items:flex-start;
    justify-content:center;
    padding:0;
    min-height: 1px;
  }

  .print-card-scale-wrapper {
    width: ${CARD_BASE_WIDTH}px;
    display: inline-block;
    transform-origin: top left;
    transform: scale(${SCALE});
    page-break-inside: avoid;
  }

  .print-card-scale-wrapper .student-card-root {
    width: 100%;
    max-width: none;
    box-shadow: none;
  }

  /* force very small gaps inside card columns */
  .student-card-kv { gap: 0; margin: 0; }

  svg { shape-rendering: crispEdges; }
</style>
</head>
<body onload="window.print();window.close();">
  <div class="print-root">
    ${pagesHTML}
  </div>
</body>
</html>`;
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  students: StudentLite[];
};

export default function StudentCardAllModal({
  open,
  onOpenChange,
  students,
}: Props) {
  const hasData = students.length > 0;
  const pages = chunkArray(students, 8);

  const handlePrintAll = () => {
    if (!hasData) return;
    const html = buildPrintHTML(students);
    const w = window.open("", "_blank", "width=1000,height=800");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl md:max-w-5xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5 text-primary" />
            Cetak Semua Kartu Peserta
            {hasData && (
              <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
                <Users className="h-4 w-4" />
                {students.length} siswa
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!hasData ? (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            Tidak ada data siswa untuk dicetak.
          </div>
        ) : (
          <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-orange-50 via-slate-50 to-sky-50 p-4 shadow-sm">
            <style dangerouslySetInnerHTML={{ __html: CARD_ALL_STYLES }} />
            <div className="max-h-[60vh] space-y-6 overflow-auto pr-1">
              {pages.map((pageStudents, pageIndex) => (
                <div
                  key={pageIndex}
                  className="space-y-3 rounded-xl border border-border/60 bg-background/70 p-3"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Halaman {pageIndex + 1}</span>
                    <span>
                      {pageStudents.length} kartu • 2 kolom × 4 baris (maks.
                      8/halaman)
                    </span>
                  </div>
                  <div className="grid gap-1 md:grid-cols-2">
                    {pageStudents.map((s) => (
                      <div
                        key={s.id}
                        className="multi-card-preview-wrapper flex justify-center"
                      >
                        <div
                          className="multi-card-preview-scale"
                          dangerouslySetInnerHTML={{
                            __html: buildCardInnerHTML(s),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button
            onClick={handlePrintAll}
            className="gap-2"
            disabled={!hasData}
          >
            <Printer className="h-4 w-4" />
            Print Semua
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}