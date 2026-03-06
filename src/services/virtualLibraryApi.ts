/**
 * Virtual Library API Service
 * RTK Query API definition for Virtual Library endpoints
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategory, IResource } from '../models';
import { APP_CONTAINER_ID } from '../app/consts';
import { AppBootConfig } from '../app/types';
import {
  SearchSuggestionRequest,
  SearchSuggestionResponse,
} from '../api/types';

/**
 * Request parameters for fetching library data
 */
export interface GetLibraryDataRequest {
  idWebuser: number; // User ID
  isManagedMode: boolean; // Whether user is in manage mode
  lineage: string; // e.g., "/Home/" or "/Home/Board Documents/"
  category: string; // Category name (e.g., "Home", "Board Documents", "Mathematics")
}

/**
 * API response for categories with permissions
 */
export interface ApiCategoryResponse {
  name: string;
  count: number; // Resource count
  categoryCount: number; // Subcategory count
  canModify: boolean;
  canDelete: boolean;
}

/**
 * API response for resources with permissions
 */
export interface ApiResourceResponse {
  id: number;
  name: string;
  url: string;
  description: string;
  canModify: boolean;
  canDelete: boolean;
  displayColumns: number;
  realFileName: string | null; // Note: API uses capital N
}

/**
 * Response structure for library data from API
 */
export interface GetLibraryDataResponse {
  categories: ApiCategoryResponse[];
  resources: ApiResourceResponse[];
}

/**
 * Get API base URL from BootConfig
 * This function reads the boot config from the DOM element at initialization time
 */
const getApiBaseUrl = (): string => {
  const bootConfigData = document
    .getElementById(APP_CONTAINER_ID)
    ?.getAttribute('data-custom-props');

  if (bootConfigData) {
    try {
      const bootConfig = JSON.parse(bootConfigData) as AppBootConfig;
      const url = bootConfig.apiBaseUrl || '/api';
      // eslint-disable-next-line no-console
      console.log('API Base URL from BootConfig:', url);
      return url;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to parse boot config:', error);
    }
  }

  // Fallback to environment variable or default
  const fallbackUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  // eslint-disable-next-line no-console
  console.log('API Base URL (fallback):', fallbackUrl);
  return fallbackUrl;
};

/**
 * API base URL - configured via BootConfig
 */
const API_BASE_URL = getApiBaseUrl();

/**
 * Virtual Library API slice using RTK Query
 */
export const virtualLibraryApi = createApi({
  reducerPath: 'virtualLibraryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Add any authentication headers if needed
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Categories', 'Resources'],
  endpoints: (builder) => ({
    /**
     * Get library data (categories and resources) by lineage and category name
     */
    getLibraryData: builder.query<
      GetLibraryDataResponse,
      GetLibraryDataRequest
    >({
      query: ({ idWebuser, isManagedMode, lineage, category }) => {
        // eslint-disable-next-line no-console
        console.log('🌐 API Request:', {
          idWebuser,
          isManagedMode,
          lineage,
          category,
        });
        return {
          url: '/Library/categories-with-resources',
          method: 'GET',
          params: {
            idWebuser,
            isManagedMode,
            lineage,
            category,
          },
        };
      },
      providesTags: (result, error, arg) => [
        { type: 'Categories', id: arg.lineage },
        { type: 'Resources', id: arg.lineage },
      ],
      // Handle errors gracefully
      transformErrorResponse: (response) => {
        // Log error in development only
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('API Error:', response);
        }
        return response;
      },
    }),

    /**
     * Get all categories (for initial load)
     */
    getAllCategories: builder.query<ICategory[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),

    /**
     * Get all resources (for initial load)
     */
    getAllResources: builder.query<IResource[], void>({
      query: () => '/resources',
      providesTags: ['Resources'],
    }),

    /**
     * Create a new category
     */
    createCategory: builder.mutation<ICategory, Partial<ICategory>>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Categories'],
    }),

    /**
     * Update an existing category
     */
    updateCategory: builder.mutation<
      ICategory,
      { id: number; data: Partial<ICategory> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Categories', id: arg.id },
        'Categories',
      ],
    }),

    /**
     * Delete a category
     */
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),

    /**
     * Create a new resource
     */
    createResource: builder.mutation<IResource, Partial<IResource>>({
      query: (resource) => ({
        url: '/resources',
        method: 'POST',
        body: resource,
      }),
      invalidatesTags: ['Resources'],
    }),

    /**
     * Update an existing resource
     */
    updateResource: builder.mutation<
      IResource,
      { id: number; data: Partial<IResource> }
    >({
      query: ({ id, data }) => ({
        url: `/resources/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Resources', id: arg.id },
        'Resources',
      ],
    }),

    /**
     * Delete a resource
     */
    deleteResource: builder.mutation<void, number>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Resources'],
    }),

    /**
     * Get search suggestions based on current state data
     * This endpoint is called when local search doesn't find matches
     */
    getSearchSuggestions: builder.mutation<
      SearchSuggestionResponse,
      SearchSuggestionRequest
    >({
      query: (body) => ({
        url: '/library/search',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetLibraryDataQuery,
  useLazyGetLibraryDataQuery,
  useGetAllCategoriesQuery,
  useGetAllResourcesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useGetSearchSuggestionsMutation,
} = virtualLibraryApi;

// Export API reducer
export default virtualLibraryApi.reducer;
