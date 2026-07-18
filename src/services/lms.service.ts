import { apiSlice } from "./base-query";
import type { Lms } from "@/types/lms";

interface GetLmsParams {
  page: number;
  paginate: number;
  search?: string;
  jenjang_id?: number | null;
  school_id?: number | null;
  subject_id?: number | null;
  subject_sub_id?: number | null;
}

export const lmsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET all LMS (paginated + filter)
    getLms: builder.query<
      {
        data: Lms[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      GetLmsParams
    >({
      query: ({
        page,
        paginate,
        search = "",
        jenjang_id,
        school_id,
        subject_id,
        subject_sub_id,
      }) => {
        const params: Record<string, string | number> = {
          page,
          paginate,
          search,
        };
        if (typeof jenjang_id === "number") params.jenjang_id = jenjang_id;
        if (typeof school_id === "number") params.school_id = school_id;
        if (typeof subject_id === "number") params.subject_id = subject_id;
        if (typeof subject_sub_id === "number")
          params.subject_sub_id = subject_sub_id;
        return { url: "/lms/lms", method: "GET", params };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Lms[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // ✅ GET by ID
    getLmsById: builder.query<Lms, number>({
      query: (id) => ({
        url: `/lms/lms/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Lms;
      }) => response.data,
    }),

    // ✅ CREATE (pakai FormData karena ada field file "cover")
    createLms: builder.mutation<Lms, FormData>({
      query: (formData) => ({
        url: "/lms/lms",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Lms;
      }) => response.data,
    }),

    // ✅ UPDATE (PUT via POST + _method=PUT)
    updateLms: builder.mutation<Lms, { id: number; payload: FormData }>({
      query: ({ id, payload }) => ({
        url: `/lms/lms/${id}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Lms;
      }) => response.data,
    }),

    // ✅ DELETE
    deleteLms: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/lms/lms/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLmsQuery,
  useGetLmsByIdQuery,
  useCreateLmsMutation,
  useUpdateLmsMutation,
  useDeleteLmsMutation,
} = lmsApi;