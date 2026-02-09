import dayjs from "dayjs";
import "dayjs/locale/id";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

// 1) Format saat KETIK (aman untuk onChange): ribuan saja, TANPA ,000
export const formatRupiah = (value: number | string) => {
  if (value === null || value === undefined || value === "") return "";
  const num =
    typeof value === "string"
      ? parseInt(
          // buang ",000" jika ada, ambil digit saja
          value.replace(/,000$/, "").replace(/\D/g, ""),
          10,
        )
      : value;

  if (!Number.isFinite(num)) return "";
  return num.toLocaleString("id-ID"); // contoh: 100000 -> "100.000"
};

// 2) Format FINAL (untuk onBlur/readonly): ribuan + selalu tambahkan ,000
export const formatRupiahWithRp = (value: number | string | null) => {
  if (value === null || value === undefined || value === "") return "Rp ";
  const num =
    typeof value === "string"
      ? parseInt(value.replace(/,000$/, "").replace(/\D/g, ""), 10)
      : value;

  if (!Number.isFinite(num)) return "Rp ";
  const base = num.toLocaleString("id-ID"); // "100.000"
  return `Rp ${base},000`; // "Rp 100.000,000"
};

// 3) Parser umum: terima input dengan/atau tanpa ,000 → kembalikan number mentah
export const parseRupiah = (raw: string) => {
  if (!raw) return 0;
  const digits = raw.replace(/,000$/, "").replace(/\D/g, "");
  const num = parseInt(digits || "0", 10);
  return Number.isFinite(num) ? num : 0;
};

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale("id");

const hasZone = (s: string) => /[zZ]|[+\-]\d{2}:\d{2}/.test(s);

// Potong fraksi detik > 3 digit (API kamu kirim .000000Z)
const normalizeIsoFraction = (s: string) =>
  s.replace(/(\.\d{3})\d+(Z)$/, "$1$2");

export function formatDate(date?: string | Date | null) {
  if (!date) return "";

  // Jika Date object dari JS, anggap local time → jadikan YYYY-MM-DD tanpa TZ
  if (date instanceof Date) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  const str = String(date).trim();
  if (!str) return "";

  // Jika ada zona waktu → konversi ke Asia/Jakarta
  if (hasZone(str)) {
    const safe = normalizeIsoFraction(str);
    return dayjs.utc(safe).tz("Asia/Jakarta").format("YYYY-MM-DD");
  }

  // Jika tanggal polos → JANGAN di-UTC/TZ (hindari geser hari)
  const parsed = dayjs(str, ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"], true);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}
export const displayDate = (dateString?: string | null) => {
  if (!dateString) return "-";

  const parsed = dayjs(
    dateString,
    ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"],
    true,
  );

  const date = parsed.isValid() ? parsed : dayjs(dateString);

  return date.isValid()
    ? date.locale("id").format("D MMMM YYYY")
    : "Tanggal tidak valid";
};

// export const formatDateForInput = (dateString?: string | null) => {
//   if (!dateString) return "";
//   const d = new Date(dateString);
//   if (isNaN(d.getTime())) return ""; // antisipasi invalid date

//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

export const formatNumber = (value?: number | string, maxDecimal = 3) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (isNaN(num)) return "-";
  return Number(num.toFixed(maxDecimal)).toString();
};

export const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  const str = String(dateString).trim();

  // 1) Izinkan nilai parsial saat user mengetik (biar gak ke-reset)
  if (
    /^(\d{4})$/.test(str) || // YYYY
    /^(\d{4})-$/.test(str) || // YYYY-
    /^(\d{4})-(\d{1,2})$/.test(str) || // YYYY-M(M)
    /^(\d{4})-(\d{2})-$/.test(str) || // YYYY-MM-
    /^(\d{4})-(\d{2})-(\d{1,2})$/.test(str) // YYYY-MM-D(D)
  ) {
    return str;
  }

  // 2) Punya zona waktu → konversi ke Asia/Jakarta
  if (hasZone(str)) {
    const safe = normalizeIsoFraction(str);
    const d = dayjs.utc(safe).tz("Asia/Jakarta");
    return d.isValid() ? d.format("YYYY-MM-DD") : "";
  }

  // 3) **TANGANI DATETIME TANPA TZ**: "YYYY-MM-DD HH:mm:ss" / "YYYY-MM-DDTHH:mm:ss(.SSS...)"
  const dt = dayjs(
    str,
    [
      "YYYY-MM-DD HH:mm:ss",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DD HH:mm:ss.SSS",
      "YYYY-MM-DDTHH:mm:ss.SSS",
      "YYYY-MM-DD HH:mm:ss.SSSSSS",
      "YYYY-MM-DDTHH:mm:ss.SSSSSS",
    ],
    true,
  );
  if (dt.isValid()) return dt.format("YYYY-MM-DD");

  // 4) Tanggal polos
  const d = dayjs(str, ["YYYY-MM-DD", "DD-MM-YYYY", "DD/MM/YYYY"], true);
  return d.isValid() ? d.format("YYYY-MM-DD") : "";
};

export const formatDateTimeForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  const str = String(dateString).trim();

  let d = dayjs(str);

  // Jika mengandung zona waktu (Z atau +07:00), konversi ke Jakarta
  if (hasZone(str)) {
    const safe = normalizeIsoFraction(str);
    d = dayjs.utc(safe).tz("Asia/Jakarta");
  }

  // Format datetime-local membutuhkan: YYYY-MM-DDTHH:mm
  return d.isValid() ? d.format("YYYY-MM-DDTHH:mm") : "";
};

// Helper untuk kirim kembali ke API (mengganti T menjadi spasi jika diperlukan API)
export const formatDateTimeForApi = (dateString: string) => {
  if (!dateString) return null;
  return dateString.replace("T", " ");
};

export const formatProgress = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return parseFloat(num.toFixed(3)); // batasi 3 angka di belakang koma
};

export function formatPhoneNumber(
  phone: string | number | null | undefined,
): string {
  if (!phone) return "-";

  // 1. Bersihkan karakter non-angka
  const str = String(phone).replace(/\D/g, "");

  // 2. Jika kosong
  if (str.length === 0) return "-";

  // 3. Logika Slicing (Fleksibel untuk segala panjang digit)
  // 0-4 digit: Biarkan polos (misal: 1234)
  if (str.length <= 4) return str;

  // 5-8 digit: Potong jadi 2 bagian (misal: 1234-5678)
  if (str.length <= 8) {
    return `${str.slice(0, 4)}-${str.slice(4)}`;
  }

  // > 8 digit: Potong jadi 3 bagian (misal: 0812-3456-7890)
  // Ini akan menangani 10, 11, 12, 13, dst digit dengan aman
  return `${str.slice(0, 4)}-${str.slice(4, 8)}-${str.slice(8, 15)}`;
}
export const formatPhoneDisplay = (value: string) => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 4) return cleaned;

  if (cleaned.length <= 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  // Jika > 8 digit, format: XXXX-XXXX-XXXX (max 13-14 digit umumnya)
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 14)}`;
};