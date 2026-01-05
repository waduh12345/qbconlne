import { apiSlice } from "@/services/base-query";
import type { School } from "@/types/master/school";

export const schoolApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolListPublic: builder.query<
      {
        data: School[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      // 👇 Update tipe argumen disini (tambah order & orderBy)
      {
        page: number;
        paginate: number;
        search?: string;
        order?: string;
        orderBy?: string;
      }
    >({
      query: ({ page, paginate, search, order, orderBy }) => {
        // Logic search existing
        const s =
          search && search.trim()
            ? `&search=${encodeURIComponent(search.trim())}`
            : "";

        // Logic order (asc/desc)
        const o = order ? `&order=${order}` : "";

        // 👇 Logic orderBy (column name, e.g., 'schools.name')
        const ob = orderBy ? `&orderBy=${orderBy}` : "";

        return {
          url: `/public/schools?page=${page}&paginate=${paginate}${s}${o}${ob}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: School[];
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

    // ✅ Get all (paginated + optional search + optional order + optional orderBy)
    getSchoolList: builder.query<
      {
        data: School[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      // 👇 Update tipe argumen disini (tambah order & orderBy)
      {
        page: number;
        paginate: number;
        search?: string;
        order?: string;
        orderBy?: string;
      }
    >({
      query: ({ page, paginate, search, order, orderBy }) => {
        const s =
          search && search.trim()
            ? `&search=${encodeURIComponent(search.trim())}`
            : "";

        // Logic order (asc/desc)
        const o = order ? `&order=${order}` : "";

        // 👇 Logic orderBy (column name, e.g., 'schools.name')
        const ob = orderBy ? `&orderBy=${orderBy}` : "";

        return {
          url: `/master/schools?page=${page}&paginate=${paginate}${s}${o}${ob}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: School[];
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

    // ✅ Get by ID
    getSchoolById: builder.query<School, number>({
      query: (id) => ({
        url: `/master/schools/${id}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: School;
      }) => response.data,
    }),

    // ✅ Create
    createSchool: builder.mutation<School, Partial<School>>({
      query: (payload) => ({
        url: `/master/schools`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: School;
      }) => response.data,
    }),

    // ✅ Update
    updateSchool: builder.mutation<
      School,
      { id: number; payload: Partial<School> }
    >({
      query: ({ id, payload }) => ({
        url: `/master/schools/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: School;
      }) => response.data,
    }),

    // ✅ Delete
    deleteSchool: builder.mutation<{ code: number; message: string }, number>({
      query: (id) => ({
        url: `/master/schools/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => ({ code: response.code, message: response.message }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSchoolListQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
  useGetSchoolListPublicQuery,
} = schoolApi;