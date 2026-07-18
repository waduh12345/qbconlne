import { apiSlice } from "@/services/base-query";
import type {
  Kampus,
  KampusPayload,
  KampusExportPayload,
} from "@/types/master/kampus";

type ListResp = {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Kampus[];
    last_page: number;
    total: number;
    per_page: number;
  };
};

type ItemResp = {
  code: number;
  message: string;
  data: Kampus;
};

export const kampusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKampusList: builder.query<
      {
        data: Kampus[];
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
        return { url: `master/kampus?${params.toString()}`, method: "GET" };
      },
      transformResponse: (r: ListResp) => ({
        data: r.data.data,
        last_page: r.data.last_page,
        current_page: r.data.current_page,
        total: r.data.total,
        per_page: r.data.per_page,
      }),
    }),

    getKampusById: builder.query<Kampus, number>({
      query: (id) => ({ url: `master/kampus/${id}`, method: "GET" }),
      transformResponse: (r: ItemResp) => r.data,
    }),

    createKampus: builder.mutation<Kampus, KampusPayload>({
      query: (payload) => ({
        url: `master/kampus`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (r: ItemResp) => r.data,
    }),

    updateKampus: builder.mutation<
      Kampus,
      { id: number; payload: KampusPayload }
    >({
      query: ({ id, payload }) => ({
        url: `master/kampus/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (r: ItemResp) => r.data,
    }),

    deleteKampus: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({ url: `master/kampus/${id}`, method: "DELETE" }),
      transformResponse: (r: { code: number; message: string }) => ({
        code: r.code,
        message: r.message,
      }),
    }),

    // Export Excel async via notifikasi
    exportKampus: builder.mutation<
      { code: number; message: string; data: string },
      KampusExportPayload | void
    >({
      query: (payload) => {
        const body: Record<string, string> = {};
        if (payload?.from_date) body.from_date = payload.from_date;
        if (payload?.to_date) body.to_date = payload.to_date;
        if (payload?.search) body.search = payload.search;
        return {
          url: `master/kampus/export`,
          method: "POST",
          body,
        };
      },
      transformResponse: (r: {
        code: number;
        message: string;
        data: string;
      }) => r,
    }),

    // Import Excel async via notifikasi
    importKampus: builder.mutation<
      { code: number; message: string; data: string },
      { file: File }
    >({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `master/kampus/import`,
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (r: {
        code: number;
        message: string;
        data: string;
      }) => r,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetKampusListQuery,
  useGetKampusByIdQuery,
  useCreateKampusMutation,
  useUpdateKampusMutation,
  useDeleteKampusMutation,
  useExportKampusMutation,
  useImportKampusMutation,
} = kampusApi;
