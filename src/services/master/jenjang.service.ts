import { apiSlice } from "@/services/base-query";
import type { Jenjang, JenjangPayload } from "@/types/master/jenjang";

type JenjangListResponse = {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Jenjang[];
    last_page: number;
    total: number;
    per_page: number;
  };
};

type JenjangItemResponse = {
  code: number;
  message: string;
  data: Jenjang;
};

export const jenjangApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJenjangList: builder.query<
      {
        data: Jenjang[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page?: number; paginate?: number; search?: string }
    >({
      query: ({ page = 1, paginate = 10, search }) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("paginate", String(paginate));
        if (search && search.trim()) params.set("search", search.trim());
        return { url: `master/jenjang?${params.toString()}`, method: "GET" };
      },
      transformResponse: (response: JenjangListResponse) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    getJenjangById: builder.query<Jenjang, number>({
      query: (id) => ({ url: `master/jenjang/${id}`, method: "GET" }),
      transformResponse: (response: JenjangItemResponse) => response.data,
    }),

    createJenjang: builder.mutation<Jenjang, JenjangPayload>({
      query: (payload) => ({
        url: `master/jenjang`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: JenjangItemResponse) => response.data,
    }),

    updateJenjang: builder.mutation<
      Jenjang,
      { id: number; payload: JenjangPayload }
    >({
      query: ({ id, payload }) => ({
        url: `master/jenjang/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: JenjangItemResponse) => response.data,
    }),

    deleteJenjang: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({ url: `master/jenjang/${id}`, method: "DELETE" }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: unknown;
      }) => ({ code: response.code, message: response.message }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetJenjangListQuery,
  useGetJenjangByIdQuery,
  useCreateJenjangMutation,
  useUpdateJenjangMutation,
  useDeleteJenjangMutation,
} = jenjangApi;
