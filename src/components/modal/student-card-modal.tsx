"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IdCard, Printer } from "lucide-react";
import * as React from "react";

export type StudentLite = {
  id: number;
  nim?: string | number | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  school_name?: string | null;
  class_name?: string | null;
  session?: string | number | null;
  room?: string | number | null;
  password?: string | number | null;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: StudentLite | null;
};

/**
 * THEME WARNA (oranye + biru, sesuai logo) + pengaturan agar warna ikut tercetak
 */
export const CARD_STYLES = `
  /* Paksa browser mencetak warna & background */
  html, body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .student-card-root,
  .student-card-header,
  .student-card-body,
  .student-card-box,
  .student-card-photo-frame,
  .student-card-idchip,
  .student-card-badge-inner {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .student-card-root {
    width: 100%;
    max-width: 720px;
    border-radius: 18px;
    border: 2px solid #e2e8f0;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
    color: #0f172a;
  }

  .student-card-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* HEADER: oranye -> biru seperti logo */
  .student-card-header {
    padding: 18px 22px;
    background: linear-gradient(120deg, #f97316 0%, #f59e0b 24%, #2563eb 68%, #1d4ed8 100%);
    background-color: #2563eb; /* fallback jika gradient di-remove */
    color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    position: relative;
  }

  .student-card-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  /* Logo kubus oranye */
  .student-card-logo {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: linear-gradient(135deg, #facc15 0%, #f97316 40%, #ea580c 80%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0f172a;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow:
      0 10px 30px rgba(15, 23, 42, 0.55),
      inset 0 0 0 1px rgba(15, 23, 42, 0.4);
  }

  .student-card-school-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .student-card-school-name {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .student-card-exam-name {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.95;
  }

  .student-card-exam-year {
    font-size: 11px;
    opacity: 0.9;
  }

  .student-card-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .student-card-exam-tag {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.26);
    border: 1px solid rgba(254, 249, 195, 0.9);
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .student-card-exam-tag-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.35);
  }

  .student-card-header-watermark {
    position: absolute;
    right: -16px;
    bottom: -40px;
    width: 140px;
    height: 140px;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 0%, rgba(248, 250, 252, 0.85) 0%, rgba(59, 130, 246, 0.4) 40%, transparent 70%);
    opacity: 0.35;
    pointer-events: none;
  }

  /* BODY: latar lembut oranye + biru */
  .student-card-body {
    padding: 18px 22px 16px 22px;
    background: radial-gradient(130% 140% at 0% 0%, #fff7ed 0%, #ffffff 55%, #e0f2fe 100%);
    background-color: #fff7ed;
  }

  .student-card-box {
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    background: radial-gradient(120% 120% at 0% 0%, #fffbeb 0%, #ffffff 45%, #eff6ff 100%);
    background-color: #fffbeb;
    padding: 18px 18px 14px 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .student-card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
  }

  .student-card-col-main {
    flex: 1 1 0;
    min-width: 0;
  }

  .student-card-divider {
    height: 1px;
    width: 100%;
    margin-bottom: 8px;
    background: linear-gradient(to right, transparent 0%, #fed7aa 15%, #bfdbfe 85%, transparent 100%);
  }

  .student-card-kv {
    display: grid;
    grid-template-columns: 135px minmax(0, 1fr);
    align-items: baseline;
    gap: 8px;
    margin: 6px 0;
  }

  .student-card-k {
    font-size: 12px;
    color: #6b7280;
  }

  .student-card-v {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }

  .student-card-col-side {
    flex: 0 0 auto;
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }

  /* FRAME FOTO: biru gradient */
  .student-card-photo-frame {
    width: 120px;
    height: 140px;
    border-radius: 18px;
    background: linear-gradient(150deg, #0ea5e9 0%, #2563eb 45%, #1e40af 80%);
    background-color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e5e7eb;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    box-shadow: 0 14px 30px rgba(30, 64, 175, 0.55);
    position: relative;
    overflow: hidden;
  }

  .student-card-photo-frame svg {
    opacity: 0.9;
  }

  .student-card-photo-overlay-label {
    position: absolute;
    bottom: 8px;
    inset-inline: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.65);
    padding: 3px 7px;
    font-size: 10px;
    text-align: center;
  }

  /* CHIP NOMOR PESERTA: oranye + biru */
  .student-card-idchip {
    margin-top: 4px;
    padding: 6px 10px;
    border-radius: 999px;
    background: #fffbeb;
    border: 1px solid #fed7aa;
    font-size: 11px;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .student-card-idchip span {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #9ca3af;
  }

  .student-card-idchip strong {
    font-size: 12px;
    letter-spacing: 0.06em;
    color: #ea580c;
  }

  /* FOOTER */
  .student-card-footer {
    padding: 10px 22px 16px 22px;
    background: #f9fafb;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .student-card-note {
    font-size: 11px;
    color: #6b7280;
    max-width: 70%;
  }

  .student-card-signature {
    min-width: 180px;
    text-align: right;
    font-size: 11px;
    color: #6b7280;
  }

  .student-card-signature-label {
    margin-bottom: 22px;
  }

  .student-card-signature-line {
    border-bottom: 1px dashed #9ca3af;
    margin-top: 12px;
  }

  .student-card-badge-bottom {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }

  .student-card-badge-inner {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: #e0f2fe;
    background-color: #e0f2fe;
    border: 1px solid #bae6fd;
    font-size: 11px;
    color: #0369a1;
    font-weight: 600;
  }

  .student-card-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #0ea5e9;
  }

  @media (max-width: 640px) {
    .student-card-body {
      padding: 14px 14px 12px 14px;
    }
    .student-card-header {
      padding: 14px 14px;
      flex-direction: column;
      align-items: flex-start;
    }
    .student-card-header-right {
      align-items: flex-start;
    }
    .student-card-row {
      flex-direction: column;
    }
    .student-card-col-side {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

export default function StudentCardModal({
  open,
  onOpenChange,
  student,
}: Props) {
  const nim = String(student?.nim ?? "—");
  const name = student?.name ?? "—";
  const kelas = student?.class_name ?? "—";
  const prodi = student?.school_name ?? "—";
  const sesi = student?.session ?? "—";
  const ruang = student?.room ?? "—";
  const pwd = student?.password ?? "—";

  // <div class="student-card-kv">
  //   <div class="student-card-k">NISN / NIS</div>
  //   <div class="student-card-v">${nim}</div>
  // </div>
  const buildCardInnerHTML = () => `
    <div class="student-card-root">
      <div class="student-card-inner">
        <div class="student-card-header">
          <div class="student-card-header-left">
            <div class="student-card-logo">
              EDU
            </div>
            <div class="student-card-school-block">
              <div class="student-card-school-name">
                ${prodi !== "—" ? prodi : "NAMA SEKOLAH"}
              </div>
              <div class="student-card-exam-name">
                KARTU PESERTA SUMATIF AKHIR TAHUN
              </div>
              <div class="student-card-exam-year">
                Tahun Pelajaran 2023/2024
              </div>
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
                  <div class="student-card-photo-overlay-label">
                    Foto 3x4
                  </div>
                </div>
                <div class="student-card-idchip">
                  <span>No. Peserta <strong>${nim}</strong></span>
                  
                </div>
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
            <div class="student-card-signature-label">
              Peserta Ujian
            </div>
            <div class="student-card-signature-line"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const buildPrintHTML = () => `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Kartu Peserta</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #e5e7eb;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  ${CARD_STYLES}
</style>
</head>
<body onload="window.print();window.close();">
  ${buildCardInnerHTML()}
</body>
</html>`;

  const onPrint = () => {
    const html = buildPrintHTML();
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl md:max-w-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5 text-primary" />
            Cetak Kartu Peserta Ujian
          </DialogTitle>
        </DialogHeader>

        {/* PREVIEW – identik dengan versi print */}
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-orange-50 via-slate-50 to-sky-50 p-4 shadow-sm">
          <style dangerouslySetInnerHTML={{ __html: CARD_STYLES }} />
          <div
            className="flex justify-center"
            dangerouslySetInnerHTML={{ __html: buildCardInnerHTML() }}
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={onPrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
