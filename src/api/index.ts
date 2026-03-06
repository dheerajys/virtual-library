import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetResourcesRequest,
  GetResourcesResponse,
  CreateCategoryRequest,
  CreateResourceRequest,
} from './types';
import { ICategory, IResource } from '../models';

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Categories', 'Resources'],
  endpoints: (builder) => ({
    // Category endpoints
    getCategories: builder.query<GetCategoriesResponse, GetCategoriesRequest>({
      query: (params) => ({
        url: '/library/categories',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ id }) => ({
                type: 'Categories' as const,
                id,
              })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    getCategoryById: builder.query<ICategory, number>({
      query: (id) => `/library/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),

    createCategory: builder.mutation<ICategory, CreateCategoryRequest>({
      query: (body) => ({
        url: '/library/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/library/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // Resource endpoints
    getResources: builder.query<GetResourcesResponse, GetResourcesRequest>({
      query: (params) => ({
        url: '/library/resources',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.resources.map(({ id }) => ({
                type: 'Resources' as const,
                id,
              })),
              { type: 'Resources', id: 'LIST' },
            ]
          : [{ type: 'Resources', id: 'LIST' }],
    }),

    getResourceById: builder.query<IResource, number>({
      query: (id) => `/library/resources/${id}`,
      providesTags: (result, error, id) => [{ type: 'Resources', id }],
    }),

    createResource: builder.mutation<IResource, CreateResourceRequest>({
      query: (body) => ({
        url: '/library/resources',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Resources', id: 'LIST' }],
    }),

    deleteResource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/library/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Resources', id: 'LIST' }],
    }),

    // Legacy email endpoints (keeping for backward compatibility)
    getEmailList: builder.query({
      query: () => '/email-list',
    }),
    addNewEmail: builder.mutation({
      query: (data) => {
        return {
          url: '/add-email',
          method: 'POST',
          body: data,
        };
      },
    }),
    deleteEmail: builder.mutation({
      query: (data) => {
        return {
          url: '/delete-email',
          method: 'DELETE',
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useAddNewEmailMutation,
  useGetEmailListQuery,
  useDeleteEmailMutation,
} = apiSlice;
