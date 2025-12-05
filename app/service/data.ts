import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "user",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://akil-backend.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("userToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint to get all opportunities
    getAllOpportunities: builder.query({
      query: () => ({ url: "/opportunities/search", method: "GET" }),
    }),

    //Endpoint to get opportunities by id
    getOpportunityById: builder.query({
      query: (id) => ({ url: `/opportunities/${id}`, method: "GET" }),
    }),

    logInUser: builder.mutation({
      query: (user) => ({
        url: `/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
      }),
    }),
    addNewUser: builder.mutation({
      query: (newUser) => ({
        url: `/signup`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: newUser,
      }),
    }),
    verifyUser: builder.mutation({
      query: (verifyCode) => ({
        url: `/verify-email`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: verifyCode,
      }),
    }),
    getBookmarks: builder.query({
      query: () => ({
        url: "/bookmarks",
        method: "GET",
      }),
    }),
    createBookmarks: builder.mutation({
      query: (jobId) => ({
        url: `/bookmarks/${jobId}`,
        method: "POST",
      }),
    }),
    deleteBookmark: builder.mutation({
      query: (jobId) => ({
        url: `/bookmarks/${jobId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllOpportunitiesQuery,
  useGetOpportunityByIdQuery,
  useAddNewUserMutation,
  useVerifyUserMutation,
  useLogInUserMutation,
  useGetBookmarksQuery,
  useCreateBookmarksMutation,
  useDeleteBookmarkMutation,
} = usersApi;
