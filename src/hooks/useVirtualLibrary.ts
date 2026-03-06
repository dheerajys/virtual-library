/**
 * Custom hook for Virtual Library data fetching with mock data fallback
 */

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useGetLibraryDataQuery,
  ApiCategoryResponse,
  ApiResourceResponse,
} from '../services/virtualLibraryApi';
import {
  setCurrentViewCategories,
  setCurrentViewResources,
} from '../store/virtualLibrarySlice';
import { getMockLibraryData } from '../services/mockDataService';
import { ICategory, IResource, ResourceType } from '../models';

/**
 * Generate a unique numeric ID from a string (category name)
 * Uses a simple hash function to convert string to number
 */
function generateIdFromName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    const char = name.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Transform API category response to internal category model
 */
function transformCategory(apiCat: ApiCategoryResponse): ICategory {
  return {
    id: generateIdFromName(apiCat.name), // Generate unique ID from category name
    idParent: null,
    idLocation: 0,
    name: apiCat.name,
    lineage: '',
    depth: 0,
    displayColumns: null,
    lineagePlusName: '',
    resourceCount: apiCat.count,
    categoryCount: apiCat.categoryCount,
    canModify: apiCat.canModify,
    canDelete: apiCat.canDelete,
  };
}

/**
 * Transform API resource response to internal resource model
 */
function transformResource(apiRes: ApiResourceResponse): IResource {
  // Determine resource type: Link (starts with https) or PDF (ends with .pdf)
  const getResourceType = (url: string): ResourceType => {
    if (url.toLowerCase().endsWith('.pdf')) {
      return ResourceType.PDF;
    }
    if (url.toLowerCase().startsWith('https')) {
      return ResourceType.Link;
    }
    return ResourceType.Link; // Default to Link
  };

  return {
    id: apiRes.id,
    idLibraryResourceCategory: 0,
    name: apiRes.name,
    description: apiRes.description,
    url: apiRes.url,
    type: getResourceType(apiRes.url),
    hitCount: 0,
    isCascading: false,
    isPublic: true,
    realFilename: apiRes.realFileName || null, // Map from API's realFileName (capital N) to our realFilename (lowercase n)
    nameWithoutHtmlTags: apiRes.name,
    descriptionWithoutHtmlTags: apiRes.description,
    idWebuserCreated: 0,
    created: new Date().toISOString(),
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: null,
    displayColumns: apiRes.displayColumns,
    canModify: apiRes.canModify,
    canDelete: apiRes.canDelete,
  };
}

/**
 * Hook to fetch library data with automatic fallback to mock data
 * @param lineage - The category lineage path (e.g., "/Home/")
 * @param category - The category name (e.g., "Home", "Board Documents")
 * @returns Query state and data
 */
const useVirtualLibrary = (
  lineage: string = '/Home/',
  category: string = 'Home'
) => {
  const dispatch = useDispatch();

  // Hardcoded user ID for now
  const idWebuser = 5970235;

  // Always use manage mode to get permission data
  // The UI will decide what to show based on isManageMode from context
  const isManagedMode = true;

  // eslint-disable-next-line no-console
  console.log('useVirtualLibrary called with:', {
    lineage,
    category,
    isManagedMode,
    idWebuser,
  });

  // Attempt to fetch data from API
  // RTK Query automatically caches based on { idWebuser, isManagedMode, lineage, category }
  // It will only make a new API call if the arguments change
  // We always request with isManagedMode=true to get permission data
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetLibraryDataQuery({
    idWebuser,
    isManagedMode,
    lineage,
    category,
  });

  // eslint-disable-next-line no-console
  console.log('RTK Query state:', {
    apiData,
    isLoading,
    isError,
    error,
    isFetching,
  });

  // Load data (from API or fallback to mock)
  useEffect(() => {
    if (apiData) {
      // API call succeeded - transform and use real data
      const transformedCategories = apiData.categories.map(transformCategory);
      const transformedResources = apiData.resources.map(transformResource);

      // eslint-disable-next-line no-console
      console.log(
        '✅ Transformed categories with IDs:',
        transformedCategories.map((c) => ({ id: c.id, name: c.name }))
      );

      dispatch(setCurrentViewCategories(transformedCategories));
      dispatch(setCurrentViewResources(transformedResources));
    } else if (isError || (!isLoading && !isFetching && !apiData)) {
      // API call failed or no data - fallback to dynamically filtered mock data
      // eslint-disable-next-line no-console
      console.warn(
        'API call failed or returned no data. Using mock data with lineage:',
        lineage,
        'category:',
        category
      );
      const mockData = getMockLibraryData(
        idWebuser,
        isManagedMode,
        lineage,
        category
      );
      const transformedCategories = mockData.categories.map(transformCategory);
      const transformedResources = mockData.resources.map(transformResource);

      // eslint-disable-next-line no-console
      console.log(
        '✅ Transformed mock categories with IDs:',
        transformedCategories.map((c) => ({ id: c.id, name: c.name }))
      );

      dispatch(setCurrentViewCategories(transformedCategories));
      dispatch(setCurrentViewResources(transformedResources));
    }
  }, [
    apiData,
    isError,
    isLoading,
    isFetching,
    dispatch,
    lineage,
    category,
    isManagedMode,
    idWebuser,
  ]);

  return {
    data: apiData,
    isLoading: isLoading || isFetching,
    isError,
    error,
    isUsingMockData: !apiData && !isLoading && !isFetching,
  };
};

export default useVirtualLibrary;
