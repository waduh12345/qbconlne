// Helper untuk membangun URL absolut ke file/aset yang di-serve oleh backend.
//
// NEXT_PUBLIC_API_BASE_URL menunjuk ke endpoint API (mis.
// "http://127.0.0.1:8000/api/v1"), sedangkan file upload (Laravel storage)
// di-serve dari origin yang sama TANPA prefix /api/v1 (mis.
// "http://127.0.0.1:8000/storage/xxx.pdf"). Jadi kita ambil origin dari base
// URL, lalu tempelkan path relatif file.

/** Origin (scheme + host + port) dari NEXT_PUBLIC_API_BASE_URL. */
export function assetOrigin(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  try {
    return new URL(base).origin;
  } catch {
    return "";
  }
}

/**
 * Ubah path/URL apa pun menjadi URL absolut yang bisa dibuka browser.
 * - URL absolut (http/https), blob:, data: dikembalikan apa adanya.
 * - Path relatif ditempel ke origin API (bukan ke /api/v1).
 * - Nilai kosong -> null.
 */
export function toAbsoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const value = String(path).trim();
  if (value === "") return null;
  if (/^(https?:|blob:|data:)/i.test(value)) return value;
  const origin = assetOrigin();
  if (!origin) return value;
  return `${origin}/${value.replace(/^\/+/, "")}`;
}

/** Bentuk minimal Spatie MediaLibrary item. */
type MediaLike = { original_url?: string | null; preview_url?: string | null } | null | undefined;

/**
 * Resolusi URL file yang bisa dilihat dari sebuah item konten.
 * Prioritas: media[].original_url (selalu absolut dari Spatie) ->
 * fallback ke field `file` (di-absolut-kan bila relatif).
 */
export function resolveContentUrl(
  file: string | null | undefined,
  media?: MediaLike[] | null,
): string | null {
  const fromMedia = (media ?? []).find((m) => m?.original_url)?.original_url;
  if (fromMedia) return toAbsoluteUrl(fromMedia);
  return toAbsoluteUrl(typeof file === "string" ? file : null);
}
