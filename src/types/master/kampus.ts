export interface Kampus {
  id: number;
  nama_kampus: string;
  prodi: string | null;
  nilai: number | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface KampusPayload {
  nama_kampus: string;
  prodi?: string | null;
  nilai?: number | null;
  status: boolean;
}

export interface KampusExportPayload {
  from_date?: string;
  to_date?: string;
  search?: string;
}
