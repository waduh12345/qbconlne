import { apiSlice } from "@/services/base-query";

/** =====================
 * Entity Type
 * ===================== */
export interface Tryout {
  id: number;
  parent_id: number | null;
  test_id: number | null;
  title: string;
  sub_title: string | null;
  slug: string;
  start_date: string; // ISO 8601
  end_date: string; // ISO 8601
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

/** =====================
 * Payload Types (API)
 * ===================== */

/** Payload yang DIKIRIM ke backend saat create */
export interface TryoutPayload {
  title: string;
  sub_title?: string | null;
  description?: string | null;
  start_date: string;
  end_date: string;
  status: boolean | number;

  // Optional relations
  parent_id?: number | null;
  test_id?: number | null;
}

/** Untuk update (Partial) */
export type TryoutUpdatePayload = Partial<TryoutPayload>;

/** =====================
 * Response Types
 * ===================== */
type TryoutListResponse = {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Tryout[];
    last_page: number;
    total: number;
    per_page: number;
  };
};

type TryoutItemResponse = {
  code: number;
  message: string;
  data: Tryout;
};

type VoidResponse = {
  code: number;
  message: string;
  data: null;
};

/** =====================
 * API Slice
 * ===================== */
export const tryoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all (paginated + optional search & sort)
    getTryoutList: builder.query<
      {
        data: Tryout[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      {
        page: number;
        paginate: number;
        search?: string;
        orderBy?: string;
        orderDirection?: "asc" | "desc";
        status?: number | boolean; // Filter by active/inactive if needed
      }
    >({
      query: ({ page, paginate, search, orderBy, orderDirection, status }) => {
        const qs = new URLSearchParams();

        // Base params
        qs.set("page", String(page));
        qs.set("paginate", String(paginate));

        // Optional params
        if (search && search.trim()) {
          qs.set("search", search.trim());
        }

        if (orderBy && orderBy.trim()) {
          qs.set("orderBy", orderBy.trim());
        }

        if (orderDirection && orderDirection.trim()) {
          qs.set("order", orderDirection.trim());
        }

        if (status !== undefined) {
          qs.set("status", String(status));
        }

        return {
          url: `/tryout/tryouts?${qs.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: TryoutListResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ Get by ID
    getTryoutById: builder.query<Tryout, number>({
      query: (id) => ({
        url: `/tryout/tryouts/${id}`,
        method: "GET",
      }),
      transformResponse: (response: TryoutItemResponse) => response.data,
    }),

    // ✅ Create
    createTryout: builder.mutation<Tryout, TryoutPayload>({
      query: (payload) => ({
        url: `/tryout/tryouts`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: TryoutItemResponse) => response.data,
    }),

    // ✅ Update
    updateTryout: builder.mutation<
      Tryout,
      { id: number; payload: TryoutUpdatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/tryout/tryouts/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: TryoutItemResponse) => response.data,
    }),

    // ✅ Delete
    deleteTryout: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/tryout/tryouts/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: VoidResponse) => ({
        code: response.code,
        message: response.message,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTryoutListQuery,
  useGetTryoutByIdQuery,
  useCreateTryoutMutation,
  useUpdateTryoutMutation,
  useDeleteTryoutMutation,
} = tryoutApi;