/**
 * Custom hook to determine content availability and appropriate view
 * Helps decide whether to show categories, resources, or empty states
 */

import { useMemo } from 'react';
import { ICategory, IResource } from '../models';

interface ContentAvailability {
  hasCategories: boolean;
  hasResources: boolean;
  isEmpty: boolean;
  shouldShowCategories: boolean;
  shouldShowResources: boolean;
  shouldAutoSwitchToResources: boolean;
  emptyStateType: 'no-subcategories' | 'no-resources' | 'no-content' | null;
}

interface UseContentAvailabilityParams {
  categories: ICategory[];
  resources: IResource[];
  currentView: 'categories' | 'resources';
  hasSearchTerm?: boolean;
}

/**
 * Hook to determine what content is available and what should be displayed
 */
const useContentAvailability = ({
  categories,
  resources,
  currentView,
  hasSearchTerm = false,
}: UseContentAvailabilityParams): ContentAvailability => {
  return useMemo(() => {
    const hasCategories = categories.length > 0;
    const hasResources = resources.length > 0;
    const isEmpty = !hasCategories && !hasResources;

    // Don't auto-switch if user is searching
    const shouldAutoSwitchToResources =
      !hasSearchTerm && !hasCategories && hasResources;

    // Determine what should be shown based on current view
    const shouldShowCategories =
      currentView === 'categories' && (hasCategories || !hasResources);
    const shouldShowResources =
      currentView === 'resources' || shouldAutoSwitchToResources;

    // Determine empty state type
    let emptyStateType: ContentAvailability['emptyStateType'] = null;
    if (isEmpty) {
      emptyStateType = 'no-content';
    } else if (currentView === 'categories' && !hasCategories && hasResources) {
      emptyStateType = 'no-subcategories';
    } else if (currentView === 'resources' && !hasResources) {
      emptyStateType = 'no-resources';
    }

    return {
      hasCategories,
      hasResources,
      isEmpty,
      shouldShowCategories,
      shouldShowResources,
      shouldAutoSwitchToResources,
      emptyStateType,
    };
  }, [categories.length, resources.length, currentView, hasSearchTerm]);
};

export default useContentAvailability;
