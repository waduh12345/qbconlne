export interface Jenjang {
  id: number;
  name: string;
  value: string | null;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface JenjangPayload {
  name: string;
  value?: string | null;
  description?: string | null;
  status: boolean;
}
