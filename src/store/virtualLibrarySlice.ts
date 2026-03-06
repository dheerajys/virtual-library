/**
 * Redux slice for Virtual Library state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ICategory,
  IResource,
  ISearchFilters,
  ResourceType,
  SearchMode,
} from '../models';
import {
  getRootCategories,
  getSubcategories,
  findCategoryById,
  hasSubcategories,
  getDescendantCategoryIds,
  countCategoryResources,
} from '../utils/categoryUtils';

/**
 * Helper function to load favorites from localStorage
 */
const loadFavoritesFromStorage = (): {
  categories: number[];
  resources: number[];
} => {
  try {
    const categoriesStr = localStorage.getItem('favoriteCategories');
    const resourcesStr = localStorage.getItem('favoriteResources');

    return {
      categories: categoriesStr ? JSON.parse(categoriesStr) : [],
      resources: resourcesStr ? JSON.parse(resourcesStr) : [],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading favorites from localStorage:', error);
    return {
      categories: [],
      resources: [],
    };
  }
};

/**
 * Helper function to save favorites to localStorage
 */
const saveFavoritesToStorage = (
  categories: number[],
  resources: number[]
): void => {
  try {
    localStorage.setItem('favoriteCategories', JSON.stringify(categories));
    localStorage.setItem('favoriteResources', JSON.stringify(resources));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving favorites to localStorage:', error);
  }
};

/**
 * Recent item interface for tracking visited items
 */
interface RecentItem {
  id: number;
  visitedAt: number; // timestamp
  type: 'category' | 'resource';
  breadcrumbPath: string[]; // Navigation path to reach this item
}

/**
 * Helper function to load recent items from localStorage
 */
const loadRecentItemsFromStorage = (): RecentItem[] => {
  try {
    const recentStr = localStorage.getItem('recentItems');
    return recentStr ? JSON.parse(recentStr) : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading recent items from localStorage:', error);
    return [];
  }
};

/**
 * Helper function to save recent items to localStorage
 */
const saveRecentItemsToStorage = (items: RecentItem[]): void => {
  try {
    localStorage.setItem('recentItems', JSON.stringify(items));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving recent items to localStorage:', error);
  }
};

interface VirtualLibraryState {
  categories: ICategory[];
  resources: IResource[];
  filteredResources: IResource[];
  filteredCategories: ICategory[];
  selectedCategoryId: number | null;
  currentViewCategories: ICategory[]; // Categories currently being displayed
  breadcrumbPath: string[]; // Array of category names representing the navigation path
  searchFilters: ISearchFilters;
  favoriteCategories: number[]; // IDs of favorite categories
  favoriteResources: number[]; // IDs of favorite resources
  recentItems: RecentItem[]; // Recently visited items
  isLoading: boolean;
  error: string | null;
}

const initialState: VirtualLibraryState = {
  categories: [],
  resources: [],
  filteredResources: [],
  filteredCategories: [],
  selectedCategoryId: null,
  currentViewCategories: [],
  breadcrumbPath: [],
  searchFilters: {
    searchTerm: '',
    selectedCategories: [],
    resourceTypes: [],
    showFeaturedOnly: false,
    searchMode: 'all',
  },
  favoriteCategories: [],
  favoriteResources: [],
  recentItems: [],
  isLoading: false,
  error: null,
};

const virtualLibrarySlice = createSlice({
  name: 'virtualLibrary',
  initialState,
  reducers: {
    /**
     * Navigate into a category
     */
    navigateToCategory: (state, action: PayloadAction<number>) => {
      const categoryId = action.payload;
      const category = findCategoryById(state.categories, categoryId);

      if (!category) {
        // eslint-disable-next-line no-console
        console.error('❌ Category not found:', categoryId);
        return;
      }

      // eslint-disable-next-line no-console
      console.log('🔍 Navigating to category:', {
        categoryId,
        categoryName: category.name,
        currentBreadcrumbPath: [...state.breadcrumbPath],
      });

      // Check if category has subcategories
      if (hasSubcategories(state.categories, categoryId)) {
        // Show subcategories
        state.currentViewCategories = getSubcategories(
          state.categories,
          categoryId
        );
        state.selectedCategoryId = null;
        state.breadcrumbPath.push(category.name); // Store name instead of ID
        state.filteredResources = [];
        // eslint-disable-next-line no-console
        console.log(
          '📂 Showing subcategories. New breadcrumbPath:',
          state.breadcrumbPath
        );
      } else {
        // Leaf category - show resources
        state.selectedCategoryId = categoryId;
        state.breadcrumbPath.push(category.name); // Store name instead of ID

        // Get resources for this category
        const resourcesInCategory = state.resources.filter(
          (r) => r.idLibraryResourceCategory === categoryId
        );
        state.filteredResources = resourcesInCategory;
        state.currentViewCategories = [];
        // eslint-disable-next-line no-console
        console.log(
          '📄 Leaf category, showing resources. New breadcrumbPath:',
          state.breadcrumbPath
        );
      }
    },

    /**
     * Navigate back to parent category or home
     */
    navigateBack: (state) => {
      if (state.breadcrumbPath.length === 0) {
        // Already at home
        return;
      }

      // Remove last breadcrumb
      state.breadcrumbPath.pop();

      if (state.breadcrumbPath.length === 0) {
        // Back to home
        state.currentViewCategories = getRootCategories(state.categories);
        state.selectedCategoryId = null;
        state.filteredResources = [];
      } else {
        // Back to parent category - find by name
        const parentCategoryName =
          state.breadcrumbPath[state.breadcrumbPath.length - 1];
        const parentCategory = state.categories.find(
          (c) => c.name === parentCategoryName
        );
        if (parentCategory) {
          state.currentViewCategories = getSubcategories(
            state.categories,
            parentCategory.id
          );
        }
        state.selectedCategoryId = null;
        state.filteredResources = [];
      }
    },

    /**
     * Navigate to a specific breadcrumb (go to any level in the path)
     */
    navigateToBreadcrumb: (state, action: PayloadAction<string>) => {
      const targetCategoryName = action.payload;
      const targetIndex = state.breadcrumbPath.indexOf(targetCategoryName);

      if (targetIndex === -1) {
        // Navigate to home
        state.breadcrumbPath = [];
        state.currentViewCategories = getRootCategories(state.categories);
        state.selectedCategoryId = null;
        state.filteredResources = [];
        return;
      }

      // Remove everything after the target
      state.breadcrumbPath = state.breadcrumbPath.slice(0, targetIndex + 1);

      // Show subcategories of target - find category by name
      const targetCategory = state.categories.find(
        (c) => c.name === targetCategoryName
      );
      if (targetCategory) {
        state.currentViewCategories = getSubcategories(
          state.categories,
          targetCategory.id
        );
      }
      state.selectedCategoryId = null;
      state.filteredResources = [];
    },

    /**
     * Go back to home (root categories)
     */
    navigateToHome: (state) => {
      state.breadcrumbPath = [];
      state.currentViewCategories = getRootCategories(state.categories);
      state.selectedCategoryId = null;
      // Show all resources at home level
      state.filteredResources = state.resources;
      state.searchFilters = {
        searchTerm: '',
        selectedCategories: [],
        resourceTypes: [],
        showFeaturedOnly: false,
        searchMode: 'all',
      };
    },

    /**
     * Update search term and apply filters
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchFilters.searchTerm = action.payload;
      virtualLibrarySlice.caseReducers.applySearchFilters(state);
    },

    /**
     * Set search mode
     */
    setSearchMode: (state, action: PayloadAction<SearchMode>) => {
      state.searchFilters.searchMode = action.payload;
      virtualLibrarySlice.caseReducers.applySearchFilters(state);
    },

    /**
     * Set resource type filters
     */
    setResourceTypeFilters: (state, action: PayloadAction<ResourceType[]>) => {
      state.searchFilters.resourceTypes = action.payload;
      virtualLibrarySlice.caseReducers.applySearchFilters(state);
    },

    /**
     * Reset all filters and go to home
     */
    resetFilters: (state) => {
      state.searchFilters = {
        searchTerm: '',
        selectedCategories: [],
        resourceTypes: [],
        showFeaturedOnly: false,
        searchMode: 'all',
      };
      // Don't reset navigation state - keep current location
      // Only reset the search/filter related state
      state.filteredCategories = [];

      // Restore resources based on current location
      if (state.selectedCategoryId !== null) {
        // If we're in a specific category, show its resources
        const resourcesInCategory = state.resources.filter(
          (r) => r.idLibraryResourceCategory === state.selectedCategoryId
        );
        state.filteredResources = resourcesInCategory;
      } else if (state.breadcrumbPath.length === 0) {
        // If at root level, show all resources
        state.filteredResources = state.resources;
      } else {
        // If viewing subcategories, keep current filtered resources
        // This handles the case where we're at a category level with subcategories
        const currentCategoryName =
          state.breadcrumbPath[state.breadcrumbPath.length - 1];
        const currentCategory = state.categories.find(
          (c) => c.name === currentCategoryName
        );
        if (currentCategory) {
          const descendantIds = getDescendantCategoryIds(
            state.categories,
            currentCategory.id
          );
          descendantIds.push(currentCategory.id);
          state.filteredResources = state.resources.filter((r) =>
            descendantIds.includes(r.idLibraryResourceCategory)
          );
        }
      }
    },

    /**
     * Add a new category
     */
    addCategory: (state, action: PayloadAction<ICategory>) => {
      const newCategory = action.payload;
      state.categories.push(newCategory);

      // Update current view if at home
      if (state.breadcrumbPath.length === 0) {
        state.currentViewCategories = getRootCategories(state.categories);
      }
    },

    /**
     * Update an existing category
     */
    updateCategory: (state, action: PayloadAction<ICategory>) => {
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(
        (cat) => cat.id === updatedCategory.id
      );

      if (index !== -1) {
        state.categories[index] = updatedCategory;

        // Update current view if category is currently displayed
        const viewIndex = state.currentViewCategories.findIndex(
          (cat) => cat.id === updatedCategory.id
        );
        if (viewIndex !== -1) {
          state.currentViewCategories[viewIndex] = updatedCategory;
        }
      }
    },

    /**
     * Delete a category
     */
    deleteCategory: (state, action: PayloadAction<number>) => {
      const categoryId = action.payload;

      // Remove category and its descendants
      const descendantIds = getDescendantCategoryIds(
        state.categories,
        categoryId
      );
      state.categories = state.categories.filter(
        (cat) => !descendantIds.includes(cat.id)
      );

      // Update current view
      if (state.breadcrumbPath.length === 0) {
        state.currentViewCategories = getRootCategories(state.categories);
      } else {
        const parentName =
          state.breadcrumbPath[state.breadcrumbPath.length - 1];
        const parentCategory = state.categories.find(
          (c) => c.name === parentName
        );
        if (parentCategory) {
          state.currentViewCategories = getSubcategories(
            state.categories,
            parentCategory.id
          );
        }
      }
    },

    /**
     * Add a new resource (appears first in the list)
     */
    addResource: (state, action: PayloadAction<IResource>) => {
      const newResource = action.payload;
      // Add to the beginning of the resources array
      state.resources = [newResource, ...state.resources];

      // If we're viewing resources for this category, add it to filtered resources too
      if (
        state.selectedCategoryId === newResource.idLibraryResourceCategory ||
        state.breadcrumbPath.length === 0
      ) {
        state.filteredResources = [newResource, ...state.filteredResources];
      }
    },

    /**
     * Update an existing resource
     */
    updateResource: (state, action: PayloadAction<IResource>) => {
      const updatedResource = action.payload;
      const index = state.resources.findIndex(
        (res) => res.id === updatedResource.id
      );

      if (index !== -1) {
        state.resources[index] = updatedResource;

        // Update filtered resources if currently displayed
        const filteredIndex = state.filteredResources.findIndex(
          (res) => res.id === updatedResource.id
        );
        if (filteredIndex !== -1) {
          state.filteredResources[filteredIndex] = updatedResource;
        }
      }
    },

    /**
     * Delete a resource
     */
    deleteResource: (state, action: PayloadAction<number>) => {
      const resourceId = action.payload;
      state.resources = state.resources.filter((res) => res.id !== resourceId);
      state.filteredResources = state.filteredResources.filter(
        (res) => res.id !== resourceId
      );
      // Remove from favorites if it was favorited
      state.favoriteResources = state.favoriteResources.filter(
        (id) => id !== resourceId
      );
    },

    /**
     * Toggle category favorite status
     */
    toggleCategoryFavorite: (state, action: PayloadAction<number>) => {
      const categoryId = action.payload;
      const isFavorite = state.favoriteCategories.includes(categoryId);

      if (isFavorite) {
        // Remove from favorites
        state.favoriteCategories = state.favoriteCategories.filter(
          (id) => id !== categoryId
        );
      } else {
        // Add to favorites at the beginning (most recent first)
        state.favoriteCategories = [categoryId, ...state.favoriteCategories];
      }

      // Update the category object's isFavorite flag
      const category = state.categories.find((cat) => cat.id === categoryId);
      if (category) {
        category.isFavorite = !isFavorite;
      }

      // Update in current view if present
      const viewCategory = state.currentViewCategories.find(
        (cat) => cat.id === categoryId
      );
      if (viewCategory) {
        viewCategory.isFavorite = !isFavorite;
      }

      // Save to localStorage
      saveFavoritesToStorage(state.favoriteCategories, state.favoriteResources);
    },

    /**
     * Toggle resource favorite status
     */
    toggleResourceFavorite: (state, action: PayloadAction<number>) => {
      const resourceId = action.payload;
      const isFavorite = state.favoriteResources.includes(resourceId);

      if (isFavorite) {
        // Remove from favorites
        state.favoriteResources = state.favoriteResources.filter(
          (id) => id !== resourceId
        );
      } else {
        // Add to favorites at the beginning (most recent first)
        state.favoriteResources = [resourceId, ...state.favoriteResources];
      }

      // Update the resource object's isFavorite flag
      const resource = state.resources.find((res) => res.id === resourceId);
      if (resource) {
        resource.isFavorite = !isFavorite;
      }

      // Update in filtered resources if present
      const filteredResource = state.filteredResources.find(
        (res) => res.id === resourceId
      );
      if (filteredResource) {
        filteredResource.isFavorite = !isFavorite;
      }

      // Save to localStorage
      saveFavoritesToStorage(state.favoriteCategories, state.favoriteResources);
    },

    /**
     * Initialize favorites from localStorage
     * Should be called when the app loads to restore favorites state
     */
    initializeFavorites: (state) => {
      const favorites = loadFavoritesFromStorage();
      state.favoriteCategories = favorites.categories;
      state.favoriteResources = favorites.resources;

      // Update the isFavorite flags on existing categories
      state.categories.forEach((category) => {
        category.isFavorite = favorites.categories.includes(category.id);
      });

      // Update the isFavorite flags on existing resources
      state.resources.forEach((resource) => {
        resource.isFavorite = favorites.resources.includes(resource.id);
      });
    },

    /**
     * Apply search filters
     */
    applySearchFilters: (state) => {
      const { searchTerm, resourceTypes } = state.searchFilters;

      // If no search term and no resource type filters, clear filtered arrays
      if (!searchTerm && resourceTypes.length === 0) {
        state.filteredCategories = [];
        // When clearing search, show all resources from the current category or all resources if at root
        if (state.selectedCategoryId) {
          state.filteredResources = state.resources.filter(
            (r) => r.idLibraryResourceCategory === state.selectedCategoryId
          );
        } else if (state.breadcrumbPath.length === 0) {
          // At root level, show all resources
          state.filteredResources = state.resources;
        } else {
          // In a category, show resources for that category - find by name
          const currentCategoryName =
            state.breadcrumbPath[state.breadcrumbPath.length - 1];
          const currentCategory = state.categories.find(
            (c) => c.name === currentCategoryName
          );
          if (currentCategory) {
            state.filteredResources = state.resources.filter(
              (r) => r.idLibraryResourceCategory === currentCategory.id
            );
          }
        }
        return;
      }

      const searchLower = searchTerm.toLowerCase();

      // Always filter categories if there's a search term, regardless of searchMode
      // This keeps the filtered results available when switching between tabs
      if (searchTerm) {
        state.filteredCategories = state.categories.filter((cat) =>
          cat.name.toLowerCase().includes(searchLower)
        );
      } else {
        state.filteredCategories = [];
      }

      // Always filter resources if there's a search term or resource type filters
      // This keeps the filtered results available when switching between tabs
      if (searchTerm || resourceTypes.length > 0) {
        let filtered = state.resources;

        // Filter by search term if present
        if (searchTerm) {
          filtered = filtered.filter(
            (resource) =>
              resource.name.toLowerCase().includes(searchLower) ||
              resource.nameWithoutHtmlTags
                .toLowerCase()
                .includes(searchLower) ||
              resource.url.toLowerCase().includes(searchLower) ||
              resource.descriptionWithoutHtmlTags
                ?.toLowerCase()
                .includes(searchLower)
          );
        }

        // Filter by resource types
        if (resourceTypes.length > 0) {
          filtered = filtered.filter((resource) =>
            resourceTypes.includes(resource.type || ResourceType.Link)
          );
        }

        state.filteredResources = filtered;
      } else {
        state.filteredResources = [];
      }
    },

    /**
     * Update categories (when fetched from API)
     */
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      // Map categories to add resource counts (creates new objects, avoiding immutability issues)
      state.categories = action.payload.map((cat) => ({
        ...cat,
        resourceCount: countCategoryResources(
          cat.id,
          state.resources,
          action.payload,
          false
        ),
      }));
      // Reset to home
      state.currentViewCategories = getRootCategories(state.categories);
    },

    /**
     * Update resources (when fetched from API)
     */
    setResources: (state, action: PayloadAction<IResource[]>) => {
      state.resources = action.payload;
      // Update resource counts for categories (creates new objects)
      state.categories = state.categories.map((cat) => ({
        ...cat,
        resourceCount: countCategoryResources(
          cat.id,
          action.payload,
          state.categories,
          false
        ),
      }));
    },

    /**
     * Set current view categories directly (for API-fetched filtered data)
     * This is used when the API returns only the relevant categories for a specific lineage
     */
    setCurrentViewCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.currentViewCategories = action.payload;
      // Merge into full categories list (avoiding duplicates)
      const existingIds = new Set(state.categories.map((c) => c.id));
      const newCategories = action.payload.filter(
        (cat) => !existingIds.has(cat.id)
      );
      if (newCategories.length > 0) {
        state.categories = [...state.categories, ...newCategories];
      }
    },

    /**
     * Set filtered resources directly (for API-fetched data)
     */
    setCurrentViewResources: (state, action: PayloadAction<IResource[]>) => {
      state.filteredResources = action.payload;
      // Merge into full resources list (avoiding duplicates)
      const existingIds = new Set(state.resources.map((r) => r.id));
      const newResources = action.payload.filter(
        (res) => !existingIds.has(res.id)
      );
      if (newResources.length > 0) {
        state.resources = [...state.resources, ...newResources];
      }
    },

    /**
     * Add item to recent visits
     * Maintains a maximum of 20 recent items
     */
    addRecentItem: (
      state,
      action: PayloadAction<{
        id: number;
        type: 'category' | 'resource';
        breadcrumbPath: string[];
      }>
    ) => {
      const { id, type, breadcrumbPath } = action.payload;
      const MAX_RECENT_ITEMS = 20;

      // Remove existing entry if present
      state.recentItems = state.recentItems.filter(
        (item) => !(item.id === id && item.type === type)
      );

      // Add new entry at the beginning
      state.recentItems.unshift({
        id,
        type,
        visitedAt: Date.now(),
        breadcrumbPath: [...breadcrumbPath], // Clone the array
      });

      // Keep only last 20 items
      if (state.recentItems.length > MAX_RECENT_ITEMS) {
        state.recentItems = state.recentItems.slice(0, MAX_RECENT_ITEMS);
      }

      // Save to localStorage
      saveRecentItemsToStorage(state.recentItems);
    },

    /**
     * Initialize recent items from localStorage
     */
    initializeRecentItems: (state) => {
      const stored = loadRecentItemsFromStorage();
      state.recentItems = stored;
    },

    /**
     * Clear all recent items
     */
    clearRecentItems: (state) => {
      state.recentItems = [];
      saveRecentItemsToStorage([]);
    },

    /**
     * Navigate to a recent item by restoring its breadcrumbPath and navigating to its location
     */
    navigateToRecentItem: (
      state,
      action: PayloadAction<{
        id: number;
        type: 'category' | 'resource';
        breadcrumbPath: string[];
      }>
    ) => {
      const { id, type, breadcrumbPath } = action.payload;

      // Restore the breadcrumb path
      state.breadcrumbPath = [...breadcrumbPath];

      if (type === 'category') {
        const category = findCategoryById(state.categories, id);
        if (!category) {
          return;
        }

        // Check if category has subcategories
        if (hasSubcategories(state.categories, id)) {
          // Show subcategories
          state.currentViewCategories = getSubcategories(state.categories, id);
          state.selectedCategoryId = null;
          state.filteredResources = [];
        } else {
          // Leaf category - show resources
          state.selectedCategoryId = id;

          // Get resources for this category
          const resourcesInCategory = state.resources.filter(
            (r) => r.idLibraryResourceCategory === id
          );

          state.filteredResources = resourcesInCategory;
          state.currentViewCategories = [];
        }
      } else {
        // For resources, navigate to the category and filter to show the resource
        // Resources don't have their own view, they're shown within categories
        // So we just restore the breadcrumb path which should put us in the right category
        const resource = state.resources.find((r) => r.id === id);
        if (resource && resource.idLibraryResourceCategory) {
          state.selectedCategoryId = resource.idLibraryResourceCategory;

          const resourcesInCategory = state.resources.filter(
            (r) =>
              r.idLibraryResourceCategory === resource.idLibraryResourceCategory
          );

          state.filteredResources = resourcesInCategory;
          state.currentViewCategories = [];
        }
      }
    },
  },
});

export const {
  navigateToCategory,
  navigateBack,
  navigateToBreadcrumb,
  navigateToHome,
  setSearchTerm,
  setSearchMode,
  setResourceTypeFilters,
  resetFilters,
  addCategory,
  updateCategory,
  deleteCategory,
  addResource,
  updateResource,
  deleteResource,
  toggleCategoryFavorite,
  toggleResourceFavorite,
  initializeFavorites,
  applySearchFilters,
  setCategories,
  setResources,
  setCurrentViewCategories,
  setCurrentViewResources,
  addRecentItem,
  initializeRecentItems,
  clearRecentItems,
  navigateToRecentItem,
} = virtualLibrarySlice.actions;

export default virtualLibrarySlice.reducer;
