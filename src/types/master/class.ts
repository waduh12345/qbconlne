import type { Jenjang } from "./jenjang";

export interface Class {
  id: number;
  jenjang_id: number | null;
  name: string;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  // Flat fields dari list endpoint
  jenjang_name?: string | null;
  jenjang_value?: string | null;
  // Relasi (eager-loaded di detail)
  jenjang?: Jenjang | null;
}
