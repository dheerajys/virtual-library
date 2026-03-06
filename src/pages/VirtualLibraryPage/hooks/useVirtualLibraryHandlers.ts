/**
 * Custom hook for VirtualLibrary page event handlers
 * Centralizes all handler logic for better organization and testability
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  navigateToCategory,
  navigateBack,
  navigateToBreadcrumb,
  navigateToHome,
  resetFilters,
  deleteCategory,
  deleteResource,
  addRecentItem,
} from '../../../store/virtualLibrarySlice';
import { ICategory, IResource } from '../../../models';

interface UseVirtualLibraryHandlersParams {
  categories: ICategory[];
  resources: IResource[];
  setViewMode: (mode: 'categories' | 'resources') => void;
  disableManageMode: () => void;
}

interface VirtualLibraryHandlers {
  handleCategoryClick: (categoryId: number) => void;
  handleBackToParent: () => void;
  handleBreadcrumbNavigate: (categoryName: string | number) => void;
  handleResetAll: () => void;
  handleGoBackToHome: () => void;
  handleExitManageMode: () => void;
  handleDeleteCategory: (categoryId: number) => void;
  handleDeleteResource: (resourceId: number) => void;
  handleEditCategory: (categoryId: number) => void;
  handleEditResource: (resourceId: number) => void;
  handleCreateCategory: () => void;
}

/**
 * Custom hook that provides all event handlers for the Virtual Library page
 */
const useVirtualLibraryHandlers = ({
  categories,
  resources,
  setViewMode,
  disableManageMode,
}: UseVirtualLibraryHandlersParams): VirtualLibraryHandlers => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get breadcrumbPath from Redux to track with recent items
  const breadcrumbPath = useSelector(
    (state: RootState) => state.virtualLibrary.breadcrumbPath
  );

  /**
   * Handle category selection - navigates into the selected category
   */
  const handleCategoryClick = useCallback(
    (categoryId: number) => {
      // Track this visit in recent items with current breadcrumb path
      dispatch(
        addRecentItem({
          id: categoryId,
          type: 'category',
          breadcrumbPath,
        })
      );

      dispatch(navigateToCategory(categoryId));
      // Set to categories view initially, useEffect will auto-switch if needed
      setViewMode('categories');
    },
    [dispatch, setViewMode, breadcrumbPath]
  );

  /**
   * Handle navigation back from subcategories to parent categories
   */
  const handleBackToParent = useCallback(() => {
    dispatch(navigateBack());
    setViewMode('categories');
  }, [dispatch, setViewMode]);

  /**
   * Handle breadcrumb navigation to specific category or home
   */
  const handleBreadcrumbNavigate = useCallback(
    (categoryName: string | number) => {
      const categoryNameStr = String(categoryName);

      if (categoryNameStr === 'Home') {
        dispatch(navigateToHome());
      } else {
        dispatch(navigateToBreadcrumb(categoryNameStr));
      }
      setViewMode('categories');
    },
    [dispatch, setViewMode]
  );

  /**
   * Handle reset all filters and navigate to categories view
   */
  const handleResetAll = useCallback(() => {
    dispatch(resetFilters());
    setViewMode('categories');
  }, [dispatch, setViewMode]);

  /**
   * Handle navigation back to home page
   */
  const handleGoBackToHome = useCallback(() => {
    dispatch(navigateToHome());
    dispatch(resetFilters());
    setViewMode('categories');
  }, [dispatch, setViewMode]);

  /**
   * Handle exit manage mode - resets to home with filters cleared
   */
  const handleExitManageMode = useCallback(() => {
    disableManageMode();
    dispatch(navigateToHome());
    dispatch(resetFilters());
    setViewMode('categories');
  }, [disableManageMode, dispatch, setViewMode]);

  /**
   * Handle category deletion in manage mode
   */
  const handleDeleteCategory = useCallback(
    (categoryId: number) => {
      dispatch(deleteCategory(categoryId));
    },
    [dispatch]
  );

  /**
   * Handle resource deletion in manage mode
   */
  const handleDeleteResource = useCallback(
    (resourceId: number) => {
      dispatch(deleteResource(resourceId));
    },
    [dispatch]
  );

  /**
   * Handle category edit - navigates to edit page with category data
   */
  const handleEditCategory = useCallback(
    (categoryId: number) => {
      const categoryToEdit = categories.find((cat) => cat.id === categoryId);
      if (categoryToEdit) {
        navigate(`/edit-category/${categoryId}`, {
          state: { category: categoryToEdit, enableManageMode: true },
        });
      }
    },
    [categories, navigate]
  );

  /**
   * Handle resource edit - navigates to edit page with resource data
   */
  const handleEditResource = useCallback(
    (resourceId: number) => {
      const resourceToEdit = resources.find((res) => res.id === resourceId);
      if (resourceToEdit) {
        navigate(`/edit-resource/${resourceId}`, {
          state: { resource: resourceToEdit, enableManageMode: true },
        });
      }
    },
    [resources, navigate]
  );

  /**
   * Handle create new category - navigates to create page
   */
  const handleCreateCategory = useCallback(() => {
    navigate('/create-category');
  }, [navigate]);

  return {
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
  };
};

export default useVirtualLibraryHandlers;
