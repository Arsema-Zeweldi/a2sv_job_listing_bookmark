import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const usersApi = createApi({
  reducerPath: "opportunities",
  baseQuery: fetchBaseQuery({ baseUrl: "https://akil-backend.onrender.com" }),
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
        header: { "Content-Type": "application/json" },
        body: user,
      }),
    }),
    addNewUser: builder.mutation({
      query: (newUser) => ({
        url: `/signup`,
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: newUser,
      }),
    }),
    verifyUser: builder.mutation({
      query: (verifyCode) => ({
        url: `/verify-email`,
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: verifyCode,
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
} = usersApi;
