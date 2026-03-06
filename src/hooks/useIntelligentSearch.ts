/**
 * useIntelligentSearch Hook
 *
 * Provides intelligent search functionality that:
 * 1. First searches locally in the current state
 * 2. If no matches found, calls API for suggestions
 * 3. Re-searches state with suggested terms
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useGetSearchSuggestionsMutation } from '../services/virtualLibraryApi';
import { ICategory, IResource } from '../models';

interface SearchResults {
  categories: ICategory[];
  resources: IResource[];
  isSearching: boolean;
  hasResults: boolean;
  searchMethod: 'local' | 'api-suggested' | null;
  suggestions: string[];
}

/**
 * Debounce utility function
 */
const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Local search function - searches in categories and resources
 */
const performLocalSearch = (
  searchTerm: string,
  categories: ICategory[],
  resources: IResource[],
  searchMode: 'categories' | 'resources' | 'all'
): { categories: ICategory[]; resources: IResource[] } => {
  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  if (!lowerSearchTerm) {
    return {
      categories: searchMode === 'resources' ? [] : categories,
      resources: searchMode === 'categories' ? [] : resources,
    };
  }

  const searchInCategories =
    searchMode === 'categories' || searchMode === 'all';
  const searchInResources = searchMode === 'resources' || searchMode === 'all';

  // Search categories
  const filteredCategories = searchInCategories
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(lowerSearchTerm)
      )
    : [];

  // Search resources (in name and description)
  const filteredResources = searchInResources
    ? resources.filter(
        (resource) =>
          resource.name.toLowerCase().includes(lowerSearchTerm) ||
          (resource.description?.toLowerCase() || '').includes(lowerSearchTerm)
      )
    : [];

  return {
    categories: filteredCategories,
    resources: filteredResources,
  };
};

/**
 * Convert state data to API request format
 */
const convertStateToApiFormat = (
  categories: ICategory[],
  resources: IResource[]
) => {
  return {
    categories: categories.map((cat) => ({
      name: cat.name,
      count: cat.resourceCount || 0,
      categoryCount: cat.categoryCount || 0,
      canModify: cat.canModify || false,
      canDelete: cat.canDelete || false,
    })),
    resources: resources.map((res) => ({
      id: res.id,
      name: res.name,
      url: res.url,
      description: res.description || '',
      canModify: res.canModify || false,
      canDelete: res.canDelete || false,
      displayColumns: res.displayColumns || 1,
      realFileName: res.realFilename || '',
    })),
  };
};

/**
 * Custom hook for intelligent search with local-first strategy
 */
const useIntelligentSearch = (searchTerm: string): SearchResults => {
  const { categories, resources, searchFilters } = useSelector(
    (state: RootState) => state.virtualLibrary
  );

  const [searchResults, setSearchResults] = useState<SearchResults>({
    categories: searchFilters.searchMode === 'resources' ? [] : categories,
    resources: searchFilters.searchMode === 'categories' ? [] : resources,
    isSearching: false,
    hasResults: true,
    searchMethod: null,
    suggestions: [],
  });

  const [getSuggestions, { isLoading: isLoadingSuggestions }] =
    useGetSearchSuggestionsMutation();

  // Use ref to track the latest search term to avoid stale closures
  const searchTermRef = useRef(searchTerm);
  searchTermRef.current = searchTerm;

  /**
   * Perform the search operation
   */
  const performSearch = useCallback(async () => {
    const currentSearchTerm = searchTermRef.current;

    // If empty search term, show all data based on search mode
    if (!currentSearchTerm.trim()) {
      setSearchResults({
        categories: searchFilters.searchMode === 'resources' ? [] : categories,
        resources: searchFilters.searchMode === 'categories' ? [] : resources,
        isSearching: false,
        hasResults: true,
        searchMethod: null,
        suggestions: [],
      });
      return;
    }

    setSearchResults((prev) => ({ ...prev, isSearching: true }));

    // Step 1: Perform local search
    const localResults = performLocalSearch(
      currentSearchTerm,
      categories,
      resources,
      searchFilters.searchMode
    );

    const hasLocalResults =
      localResults.categories.length > 0 || localResults.resources.length > 0;

    if (hasLocalResults) {
      // Found results locally, no need for API call
      setSearchResults({
        categories: localResults.categories,
        resources: localResults.resources,
        isSearching: false,
        hasResults: true,
        searchMethod: 'local',
        suggestions: [],
      });
      return;
    }

    // Step 2: No local results, call API for suggestions
    try {
      const apiData = convertStateToApiFormat(categories, resources);
      const response = await getSuggestions({
        data: apiData,
        searchWord: currentSearchTerm,
      }).unwrap();

      const suggestions = response.suggestions || [];

      if (suggestions.length === 0) {
        // No suggestions from API either
        setSearchResults({
          categories: [],
          resources: [],
          isSearching: false,
          hasResults: false,
          searchMethod: 'api-suggested',
          suggestions: [],
        });
        return;
      }

      // Step 3: Search state with suggested terms
      const { combinedCategories, combinedResources } = suggestions.reduce(
        (acc, suggestion) => {
          const suggestedResults = performLocalSearch(
            suggestion,
            categories,
            resources,
            searchFilters.searchMode
          );

          // Merge results, avoiding duplicates
          suggestedResults.categories.forEach((cat) => {
            if (!acc.combinedCategories.find((c) => c.id === cat.id)) {
              acc.combinedCategories.push(cat);
            }
          });

          suggestedResults.resources.forEach((res) => {
            if (!acc.combinedResources.find((r) => r.id === res.id)) {
              acc.combinedResources.push(res);
            }
          });

          return acc;
        },
        {
          combinedCategories: [] as ICategory[],
          combinedResources: [] as IResource[],
        }
      );

      setSearchResults({
        categories: combinedCategories,
        resources: combinedResources,
        isSearching: false,
        hasResults:
          combinedCategories.length > 0 || combinedResources.length > 0,
        searchMethod: 'api-suggested',
        suggestions,
      });
    } catch (error) {
      // Fallback to empty results on API error
      // Error is silently handled - API failures shouldn't break search
      setSearchResults({
        categories: [],
        resources: [],
        isSearching: false,
        hasResults: false,
        searchMethod: null,
        suggestions: [],
      });
    }
  }, [categories, resources, searchFilters.searchMode, getSuggestions]);

  // Debounced search function - wrapped in useMemo to avoid recreation
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  // Trigger search when search term or dependencies change
  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  return {
    ...searchResults,
    isSearching: searchResults.isSearching || isLoadingSuggestions,
  };
};

export default useIntelligentSearch;
