import { Tryout } from "@/services/tryout/sub-tryout.service";

interface SchoolExcept {
  id: number;
  province_id: string;
  regency_id: string;
  district_id:string;
  village_id: string;
  name: string;
  description: string;
  status: number | boolean;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: number;
  school_id: number;
  title: string;
  sub_title: string | null;
  slug: string;
  description: string | null;
  total_time: number;
  total_questions: number;
  pass_grade: number;
  shuffle_questions: boolean | number;
  assessment_type: string;
  timer_type: string;
  score_type: string;
  start_date: string;
  end_date: string;
  code: string | null;
  max_attempts: string | null;
  total_participants: number;
  is_graded: boolean;
  is_explanation_released: boolean;
  created_at: string;
  updated_at: string;
  parent_id?: number | null;
  parent: Test | null;
  tryout_id?: number | null;
  tryout: Tryout | null;
  schools?: Array<{
    id: number;
    name: string;
    description: string | null;
    status: boolean;
    created_at: string;
    updated_at: string;
    district_id: string;
    regency_id: string;
    province_id: string;
    village_id: string;
    pivot: {
      test_id: number;
      school_id: number;
    };
  }>;
  school_name?: string;
  status?: boolean | number;
  user_id: number | null;
  pengawas_name: string | null;
  all_school: number; // 🆕 1 atau 0
  school_except_id?: number[];
  school_excepts: SchoolExcept[];
  group_number?: number | null;
  pembagian?: number | null;
}

// ===== API enums yang dipakai payload =====
export type TimerType = string;
export type ScoreType = string; // 'irt' | 'default'
export type AssessmentType = string; // 'irt' | 'standard'

// ===== Payload untuk CREATE/UPDATE ke backend =====
export interface TestPayload {
  school_id: number[];
  title: string;
  sub_title: string | null;
  shuffle_questions: boolean | number; // <- sesuai backend
  timer_type: TimerType; // 'per_test' | 'per_category'
  score_type: ScoreType; // 'irt' | 'default'

  // field kondisional:
  total_time?: number; // wajib jika timer_type = 'per_test'
  start_date?: string; // wajib jika score_type = 'irt'
  end_date?: string; // wajib jika score_type = 'irt'

  // field lain yang backend-mu terima (opsional)
  slug?: string;
  description?: string | null;
  total_questions?: number;
  pass_grade?: number;
  assessment_type?: AssessmentType;
  code?: string | null;
  max_attempts?: string | null;
  status?: number;
  is_graded?: boolean;
  is_explanation_released?: boolean;
  all_school: number;
  user_id: number;
  parent_id: number | null;
  tryout_id: number | null;
  school_except_id?: number[];
  group_number?: number | null;
  pembagian?: number | null;
}

// Untuk update jika backend mengizinkan parsial
export type TestUpdatePayload = Partial<TestPayload>;