import { Class } from "./master/class";
import { School } from "./master/school";

export interface Student {
  id: number;
  user_id: number;
  nim: number | string;
  school_id: number;
  status: boolean | number;
  is_premium: boolean | number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  sc_name?: string;
  // school_name = freetext yang diisi siswa saat register (jika tidak pilih school_id)
  school_name: string;
  // school_name_text = nama sekolah ter-resolve dari school_id (lebih prioritas untuk display)
  school_name_text?: string | null;
  password: string;
  password_confirmation: string;
  role_id: number;
  class_id: number;
  class_name: string;
  school: School;
  class: Class | null;
}