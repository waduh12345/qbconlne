import type { Jenjang } from "./master/jenjang";

export interface Lms {
  id: number;
  subject_id: number;
  subject_sub_id: number;
  title: string;
  sub_title: string | null;
  slug: string;
  description: string | null;
  status: boolean | number;
  created_at: string;
  updated_at: string;
  subject_code: string;
  subject_name: string;
  subject_sub_code: string;
  subject_sub_name: string;
  cover: File | string | null;
  school_id: number | null;
  school_name: string | null;
  // Premium gating per-jenjang. Konten dengan jenjang_id != null hanya
  // boleh diakses siswa premium yang class.jenjang_id-nya cocok.
  jenjang_id: number | null;
  jenjang_name?: string | null;
  jenjang_value?: string | null;
  jenjang?: Jenjang | null;
  subject?: { id: number; code: string | null; name: string } | null;
  subjectSub?: { id: number; code: string | null; name: string } | null;
}
