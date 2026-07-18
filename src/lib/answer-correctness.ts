// Shared answer-correctness helpers.
//
// Digunakan bersama oleh halaman review siswa (score/[id]) dan modal detail
// admin (rank → Detail / Detail PG) supaya penilaian benar/salah KONSISTEN dan
// TIDAK sensitif terhadap urutan pilihan.
//
// Kasus utama yang diperbaiki: soal multiple_choice_multiple_answer dengan
// jawaban "A,C,E" dan kunci "A,E,C" harus dianggap BENAR (set-equality), bukan
// dibandingkan sebagai string mentah ("a,c,e" !== "a,e,c").

/**
 * Normalisasi jawaban menjadi set huruf kecil yang unik & terurut.
 * "C, a ,D,a" -> ["a", "c", "d"]
 */
export const normalizeAnswerSet = (raw: string | null | undefined): string[] => {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 0),
    ),
  ).sort();
};

/** Perbandingan dua array (sudah terurut) sebagai set. */
export const arrEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

/**
 * Order-insensitive set-equality antara jawaban siswa dan kunci.
 * - Jawaban kosong tidak pernah dianggap benar.
 * - Kunci kosong/undefined tidak bisa dinilai -> false.
 * Menangani "A,C,E" vs "A,E,C" (benar) dan perbedaan huruf besar/kecil.
 */
export const isChoiceAnswerCorrect = (
  userAnswer: string | null | undefined,
  correctKey: string | null | undefined,
): boolean => {
  const userSet = normalizeAnswerSet(userAnswer);
  const keySet = normalizeAnswerSet(correctKey);
  if (userSet.length === 0 || keySet.length === 0) return false;
  return arrEqual(userSet, keySet);
};

/**
 * Format tampilan jawaban: huruf kapital, urut alfabet, dipisah koma.
 * "c,a,d" -> "A, C, D". Kosong -> "-".
 */
export const formatAnswerDisplay = (raw: string | null | undefined): string => {
  const arr = normalizeAnswerSet(raw);
  if (arr.length === 0) return "-";
  return arr.map((s) => s.toUpperCase()).join(", ");
};

/** Tipe soal pilihan yang dinilai otomatis via set-equality huruf. */
export const CHOICE_TYPES = [
  "multiple_choice",
  "true_false",
  "multiple_choice_multiple_answer",
] as const;

export const isChoiceType = (type: string | null | undefined): boolean =>
  !!type && (CHOICE_TYPES as readonly string[]).includes(type);
