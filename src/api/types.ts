/**
 * API request and response types
 */

import { ICategory, IResource } from '../models';

export interface BaseRequest {
  apiBaseUri: string;
}

/**
 * Response for getting categories
 */
export interface GetCategoriesResponse {
  categories: ICategory[];
  totalCount: number;
}

/**
 * Request parameters for getting categories
 */
export interface GetCategoriesRequest {
  idParent?: number | null; // Filter by parent category (null for root categories)
  depth?: number; // Filter by depth level
  searchTerm?: string; // Search in category names
}

/**
 * Response for getting resources
 */
export interface GetResourcesResponse {
  resources: IResource[];
  totalCount: number;
}

/**
 * Request parameters for getting resources
 */
export interface GetResourcesRequest {
  idLibraryResourceCategory?: number; // Filter by category
  searchTerm?: string; // Search in resource names and descriptions
  isPublic?: boolean; // Filter public/private resources
  includeDescendants?: boolean; // Include resources from subcategories
}

/**
 * Request for creating a category
 */
export interface CreateCategoryRequest {
  name: string;
  idParent: number | null;
  idLocation: number;
}

/**
 * Request for creating a resource
 */
export interface CreateResourceRequest {
  idLibraryResourceCategory: number;
  name: string;
  description: string | null;
  url: string;
  isPublic: boolean;
  isCascading: boolean;
}

/**
 * Search suggestion request
 */
export interface SearchSuggestionRequest {
  data: {
    categories: Array<{
      name: string;
      count: number;
      categoryCount: number;
      canModify: boolean;
      canDelete: boolean;
    }>;
    resources: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      canModify: boolean;
      canDelete: boolean;
      displayColumns: number;
      realFileName: string;
    }>;
  };
  searchWord: string;
}

/**
 * Search suggestion response
 */
export interface SearchSuggestionResponse {
  suggestions: string[];
}
