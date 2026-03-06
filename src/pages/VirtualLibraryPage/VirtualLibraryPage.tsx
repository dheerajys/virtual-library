/**
 * Virtual Library main page component
 * Displays categories and resources with advanced search and filtering
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Container, Box, Divider } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  toggleCategoryFavorite,
  toggleResourceFavorite,
  initializeFavorites,
  initializeRecentItems,
  addRecentItem,
} from '../../store/virtualLibrarySlice';
import {
  useVirtualLibrary,
  useContentAvailability,
  useIntelligentSearch,
} from '../../hooks';
import { SearchBar } from '../../components/SearchBar';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { QuickAccessSection } from '../../components/QuickAccessSection';
import LoadingState from '../../components/LoadingState';
import { IBreadcrumb, IResource } from '../../models';
import {
  ManageModeProvider,
  useManageMode,
} from '../../contexts/ManageModeContext';
import {
  PageHeader,
  NavigationTabs,
  NotificationSnackbars,
  CategoriesView,
  ResourcesView,
  RecentView,
} from './components';
import { useVirtualLibraryHandlers } from './hooks';

type ViewMode = 'categories' | 'resources' | 'recent';

const VirtualLibraryPageContent: React.FC = () => {
  const dispatch = useDispatch();
  const { isManageMode, disableManageMode, enableManageMode } = useManageMode();

  // Redux state
  const {
    categories,
    resources,
    filteredResources,
    filteredCategories,
    selectedCategoryId,
    currentViewCategories,
    breadcrumbPath,
    searchFilters,
    favoriteCategories,
    favoriteResources,
    recentItems,
  } = useSelector((state: RootState) => state.virtualLibrary);

  // Local state - View mode
  const [viewMode, setViewMode] = useState<ViewMode>('categories');

  // Local state - Notifications
  const [showMockDataAlert, setShowMockDataAlert] = useState(false);
  const [showNoCategoriesNotification, setShowNoCategoriesNotification] =
    useState(false);
  const [showNoResourcesNotification, setShowNoResourcesNotification] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom hook for all event handlers
  const {
    handleCategoryClick,
    handleBackToParent,
    handleBreadcrumbNavigate,
    handleResetAll,
    handleGoBackToHome,
    handleExitManageMode,
    handleDeleteCategory,
    handleDeleteResource,
    handleEditCategory,
    handleEditResource,
    handleCreateCategory,
  } = useVirtualLibraryHandlers({
    categories,
    resources,
    setViewMode,
    disableManageMode,
  });

  // Intelligent search hook - searches locally first, then calls API for suggestions
  const intelligentSearchResults = useIntelligentSearch(
    searchFilters.searchTerm
  );

  // Use intelligent search results when search term exists, otherwise use Redux filtered data
  const displayCategories = searchFilters.searchTerm.trim()
    ? intelligentSearchResults.categories
    : filteredCategories;

  const displayResources = searchFilters.searchTerm.trim()
    ? intelligentSearchResults.resources
    : filteredResources;

  // Initialize favorites from localStorage on component mount
  useEffect(() => {
    dispatch(initializeFavorites());
    dispatch(initializeRecentItems());
  }, [dispatch]);

  // Check for success message and manage mode state from navigation
  useEffect(() => {
    const state = window.history.state?.usr;
    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
      // Clear the state after displaying
      window.history.replaceState({}, document.title);
    }
    if (state?.enableManageMode) {
      enableManageMode();
      // Clear the state after enabling
      window.history.replaceState({}, document.title);
    }
    if (state?.showResources) {
      setViewMode('resources');
      // Clear the state after setting view mode
      window.history.replaceState({}, document.title);
    }
  }, [enableManageMode]);

  // Determine content availability and appropriate view
  const contentAvailability = useContentAvailability({
    categories: currentViewCategories,
    resources: displayResources,
    currentView: viewMode === 'recent' ? 'categories' : viewMode,
    hasSearchTerm: !!searchFilters.searchTerm.trim(),
  });

  // Compute lineage and category name for API call
  const { currentLineage, currentCategoryName } = useMemo(() => {
    // For home page (no breadcrumb path), use '/Home/' and 'Home'
    if (breadcrumbPath.length === 0) {
      return { currentLineage: '/Home/', currentCategoryName: 'Home' };
    }

    // Build lineage from breadcrumb path (which now contains category names)
    let lineage = '/Home/';
    breadcrumbPath.forEach((categoryName) => {
      lineage += `${categoryName}/`;
    });

    // The last category name in the path is the current category
    const categoryName = breadcrumbPath[breadcrumbPath.length - 1];

    // eslint-disable-next-line no-console
    console.log('📍 Lineage calculation:', {
      breadcrumbPath,
      calculatedLineage: lineage,
      calculatedCategoryName: categoryName,
    });

    return {
      currentLineage: lineage,
      currentCategoryName: categoryName,
    };
  }, [breadcrumbPath]);

  // Fetch library data with fallback to mock data
  // Note: Always fetches with manage mode permissions enabled
  // The UI decides what to show based on isManageMode from context
  const { isLoading, isUsingMockData } = useVirtualLibrary(
    currentLineage,
    currentCategoryName
  );

  // Show alert when using mock data (only once when mock data is first detected)
  useEffect(() => {
    if (isUsingMockData) {
      setShowMockDataAlert(true);
    }
  }, [isUsingMockData]);

  // Auto-switch to resources tab when category has no subcategories
  useEffect(() => {
    if (!isLoading) {
      // Check if we're viewing a category with no subcategories but has resources
      // Don't auto-switch in manage mode - let users stay on categories to create
      if (
        viewMode === 'categories' &&
        currentViewCategories.length === 0 &&
        displayResources.length > 0 &&
        !searchFilters.searchTerm &&
        !isManageMode
      ) {
        // Auto-switch to resources tab
        setViewMode('resources');
        // Show notification
        setShowNoCategoriesNotification(true);
      }
      // Check if we're viewing a category with no resources but has subcategories
      // Don't auto-switch in manage mode - let users stay on resources to create
      else if (
        viewMode === 'resources' &&
        displayResources.length === 0 &&
        currentViewCategories.length > 0 &&
        !searchFilters.searchTerm &&
        !isManageMode
      ) {
        // Auto-switch to categories tab
        setViewMode('categories');
        // Show notification
        setShowNoResourcesNotification(true);
      }
    }
  }, [
    isLoading,
    viewMode,
    currentViewCategories.length,
    displayResources.length,
    searchFilters.searchTerm,
    isManageMode,
  ]);

  // Auto-switch tabs when searchMode changes (one-time action)
  useEffect(() => {
    // Only auto-switch if there's a search term AND the mode just changed
    if (searchFilters.searchTerm) {
      if (
        searchFilters.searchMode === 'categories' &&
        viewMode === 'resources'
      ) {
        // User toggled off resources while on resources tab - switch to categories
        setViewMode('categories');
      } else if (
        searchFilters.searchMode === 'resources' &&
        viewMode === 'categories'
      ) {
        // User toggled off categories while on categories tab - switch to resources
        setViewMode('resources');
      }
    }
    // Only run when searchMode changes, not when viewMode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters.searchMode, searchFilters.searchTerm]);

  // Handle tab change with validation
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ViewMode
  ) => {
    // If trying to switch to categories tab but no categories are available
    // Allow switching in manage mode so users can create categories
    if (
      newValue === 'categories' &&
      currentViewCategories.length === 0 &&
      displayResources.length > 0 &&
      !searchFilters.searchTerm &&
      !isManageMode
    ) {
      // Show notification and stay on resources tab (only in normal mode)
      setShowNoCategoriesNotification(true);
      return;
    }

    // If trying to switch to resources tab but no resources are available
    // Allow switching in manage mode so users can create resources
    if (
      newValue === 'resources' &&
      displayResources.length === 0 &&
      currentViewCategories.length > 0 &&
      !searchFilters.searchTerm &&
      !isManageMode
    ) {
      // Show notification and stay on categories tab (only in normal mode)
      setShowNoResourcesNotification(true);
      return;
    }

    // Allow the tab change
    setViewMode(newValue);
  };

  // Build breadcrumbs
  const breadcrumbs: IBreadcrumb[] = useMemo(() => {
    // Always start with Home
    const items: IBreadcrumb[] = [
      {
        id: 'Home',
        label: 'Home',
      },
    ];

    // Add the rest of the breadcrumb path
    if (breadcrumbPath.length > 0) {
      breadcrumbPath.forEach((categoryName) => {
        items.push({
          id: categoryName,
          label: categoryName,
        });
      });
    }

    return items;
  }, [breadcrumbPath]);

  // Get active category
  const activeCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  // Check if any filters are active
  const hasActiveFilters =
    !!searchFilters.searchTerm || searchFilters.resourceTypes.length > 0;

  // Favorite handlers
  const handleToggleCategoryFavorite = (categoryId: number) => {
    dispatch(toggleCategoryFavorite(categoryId));
  };

  const handleToggleResourceFavorite = (resourceId: number) => {
    dispatch(toggleResourceFavorite(resourceId));
  };

  // Get favorite items for Quick Access
  const favoriteCategoryItems = useMemo(() => {
    return categories.filter((cat) => favoriteCategories.includes(cat.id));
  }, [categories, favoriteCategories]);

  const favoriteResourceItems = useMemo(() => {
    return resources.filter((res) => favoriteResources.includes(res.id));
  }, [resources, favoriteResources]);

  // Handler for clicking a favorite resource in Quick Access
  const handleFavoriteResourceClick = (resource: IResource) => {
    // Track this visit in recent items with current breadcrumb path
    dispatch(
      addRecentItem({
        id: resource.id,
        type: 'resource',
        breadcrumbPath,
      })
    );

    // Default behavior: open the URL
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Notifications */}
      <NotificationSnackbars
        successMessage={successMessage}
        showMockDataAlert={showMockDataAlert}
        showNoCategoriesNotification={showNoCategoriesNotification}
        showNoResourcesNotification={showNoResourcesNotification}
        onCloseSuccess={() => setSuccessMessage(null)}
        onCloseMockData={() => setShowMockDataAlert(false)}
        onCloseNoCategories={() => setShowNoCategoriesNotification(false)}
        onCloseNoResources={() => setShowNoResourcesNotification(false)}
      />

      {/* Page Header */}
      <PageHeader
        isManageMode={isManageMode}
        viewMode={viewMode === 'recent' ? 'categories' : viewMode}
        onExitManageMode={handleExitManageMode}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} onNavigate={handleBreadcrumbNavigate} />

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar />
      </Box>

      {/* Quick Access Section */}
      {(favoriteCategoryItems.length > 0 ||
        favoriteResourceItems.length > 0) && (
        <QuickAccessSection
          favoriteCategories={favoriteCategoryItems}
          favoriteResources={favoriteResourceItems}
          onCategoryClick={handleCategoryClick}
          onResourceClick={handleFavoriteResourceClick}
          onToggleCategoryFavorite={handleToggleCategoryFavorite}
          onToggleResourceFavorite={handleToggleResourceFavorite}
        />
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Loading State */}
      {isLoading && viewMode !== 'recent' && <LoadingState type={viewMode} />}

      {/* Main Content - Tabs and Content Area */}
      {!isLoading && (
        <>
          {/* Navigation Tabs */}
          <NavigationTabs
            viewMode={viewMode}
            resourceCount={displayResources.length}
            recentCount={recentItems.length}
            hasActiveFilters={hasActiveFilters}
            onTabChange={handleTabChange}
            onResetAll={handleResetAll}
          />

          <Divider sx={{ mb: 4 }} />

          {/* View Content */}
          {viewMode === 'categories' && (
            <CategoriesView
              currentViewCategories={currentViewCategories}
              filteredCategories={displayCategories}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              breadcrumbPath={breadcrumbPath}
              searchTerm={searchFilters.searchTerm}
              searchMode={searchFilters.searchMode}
              isManageMode={isManageMode}
              contentAvailability={contentAvailability}
              onCategoryClick={handleCategoryClick}
              onBackToParent={handleBackToParent}
              onResetAll={handleResetAll}
              onGoBackToHome={handleGoBackToHome}
              onEnableManageMode={enableManageMode}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
              onCreateCategory={handleCreateCategory}
              onSwitchToResources={() => setViewMode('resources')}
              onToggleFavorite={handleToggleCategoryFavorite}
            />
          )}

          {viewMode === 'resources' && (
            <ResourcesView
              filteredResources={displayResources}
              activeCategory={activeCategory}
              breadcrumbPath={breadcrumbPath}
              searchTerm={searchFilters.searchTerm}
              resourceTypesFilter={searchFilters.resourceTypes}
              isManageMode={isManageMode}
              contentAvailability={contentAvailability}
              onBackToParent={handleBackToParent}
              onResetAll={handleResetAll}
              onGoBackToHome={handleGoBackToHome}
              onEnableManageMode={enableManageMode}
              onDeleteResource={handleDeleteResource}
              onEditResource={handleEditResource}
              onToggleFavorite={handleToggleResourceFavorite}
            />
          )}

          {viewMode === 'recent' && (
            <RecentView
              isManageMode={isManageMode}
              onResourceClick={handleFavoriteResourceClick}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
              onDeleteResource={handleDeleteResource}
              onEditResource={handleEditResource}
              onToggleCategoryFavorite={handleToggleCategoryFavorite}
              onToggleResourceFavorite={handleToggleResourceFavorite}
              setViewMode={setViewMode}
            />
          )}
        </>
      )}
    </Container>
  );
};

// Wrap the content component with ManageModeProvider
// eslint-disable-next-line react/no-multi-comp
const VirtualLibraryPage: React.FC = () => {
  return (
    <ManageModeProvider>
      <VirtualLibraryPageContent />
    </ManageModeProvider>
  );
};

export default VirtualLibraryPage;
