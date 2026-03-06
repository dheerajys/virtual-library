/**
 * Categories View Component
 * Displays categories grid with different states (subcategories, root, search results)
 */
import React from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ICategory } from '../../../models';
import { CategoryCard } from '../../../components/CategoryCard';
import { EmptyState } from '../../../components/EmptyState';

// ContentAvailability interface
interface IContentAvailability {
  hasCategories: boolean;
  hasResources: boolean;
  isEmpty: boolean;
  shouldShowCategories: boolean;
  shouldShowResources: boolean;
  shouldAutoSwitchToResources: boolean;
  emptyStateType: 'no-subcategories' | 'no-resources' | 'no-content' | null;
}

interface CategoriesViewProps {
  currentViewCategories: ICategory[];
  filteredCategories: ICategory[];
  categories: ICategory[];
  selectedCategoryId: number | null;
  breadcrumbPath: string[];
  searchTerm: string;
  searchMode: 'all' | 'categories' | 'resources';
  isManageMode: boolean;
  contentAvailability: IContentAvailability;
  onCategoryClick: (categoryId: number) => void;
  onBackToParent: () => void;
  onResetAll: () => void;
  onGoBackToHome: () => void;
  onEnableManageMode: () => void;
  onDeleteCategory: (categoryId: number) => void;
  onEditCategory: (categoryId: number) => void;
  onCreateCategory: () => void;
  onSwitchToResources: () => void;
  onToggleFavorite: (categoryId: number) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({
  currentViewCategories,
  filteredCategories,
  categories,
  selectedCategoryId,
  breadcrumbPath,
  searchTerm,
  searchMode,
  isManageMode,
  contentAvailability,
  onCategoryClick,
  onBackToParent,
  onResetAll,
  onGoBackToHome,
  onEnableManageMode,
  onDeleteCategory,
  onEditCategory,
  onCreateCategory,
  onSwitchToResources,
  onToggleFavorite,
}) => {
  const isViewingSubcategories = breadcrumbPath.length > 0;
  const shouldShowFilteredCategories = searchTerm && searchMode !== 'resources';
  const displayCategories = shouldShowFilteredCategories
    ? filteredCategories
    : currentViewCategories;

  if (isViewingSubcategories && !searchTerm) {
    // Viewing Subcategories
    const parentCategoryName = breadcrumbPath[breadcrumbPath.length - 1];
    const parentCategory = categories.find(
      (c) => c.name === parentCategoryName
    );

    return (
      <>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToParent}
            variant="outlined"
            sx={{ mb: 2 }}
            id="back-to-categories-btn"
          >
            Back to {breadcrumbPath.length > 1 ? 'Parent' : 'All Categories'}
          </Button>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 1, fontSize: '16px' }}
          >
            {parentCategory?.name || 'Category'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a category to view its sub-categories or resources
          </Typography>
        </Box>

        {currentViewCategories.length === 0 && isManageMode && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: '#ce93d8',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, fontSize: '16px' }}
              >
                No Subcategories
              </Typography>
              <Typography variant="body1" color="text.secondary">
                There are no subcategories for{' '}
                {parentCategory?.name || 'this category'}.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateCategory}
              id="create-subcategory-btn"
              sx={{
                minWidth: 200,
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)',
                  boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
                },
              }}
            >
              Create Category
            </Button>
          </Paper>
        )}

        {currentViewCategories.length === 0 && !isManageMode && (
          <EmptyState
            type="no-subcategories"
            categoryName={parentCategory?.name}
            onSwitchToResources={onSwitchToResources}
            onManageMode={onEnableManageMode}
            onBackToHome={onGoBackToHome}
            canManage
          />
        )}

        {currentViewCategories.length > 0 && (
          <Grid container spacing={3}>
            {currentViewCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={category}
                  onClick={onCategoryClick}
                  isSelected={selectedCategoryId === category.id}
                  isManageMode={isManageMode}
                  onDelete={onDeleteCategory}
                  onEdit={onEditCategory}
                  onToggleFavorite={onToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </>
    );
  }

  // Viewing Root Categories or Search Results
  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 1, fontSize: '16px' }}
          >
            Browse Categories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? `${displayCategories.length} ${
                  displayCategories.length === 1 ? 'category' : 'categories'
                } found`
              : 'Select a category to view its sub-categories or resources'}
          </Typography>
        </Box>
        {isManageMode && (
          <Button
            id="create-category-btn"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateCategory}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              px: 3,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Create Category
          </Button>
        )}
      </Box>

      {displayCategories.length === 0 ? (
        (() => {
          if (searchTerm) {
            return (
              <EmptyState
                type="no-search-results"
                searchTerm={searchTerm}
                onClearSearch={onResetAll}
                onBackToHome={onGoBackToHome}
              />
            );
          }

          if (contentAvailability.emptyStateType === 'no-content') {
            if (isManageMode) {
              return (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    background:
                      'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: '#ce93d8',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: '20px' }}
                    >
                      No Content
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Start by creating your first category.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateCategory}
                    id="create-first-category-btn"
                    sx={{
                      minWidth: 200,
                      background:
                        'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)',
                        boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
                      },
                    }}
                  >
                    Create Category
                  </Button>
                </Paper>
              );
            }

            return (
              <EmptyState
                type="no-content"
                categoryName={
                  breadcrumbPath.length > 0
                    ? breadcrumbPath[breadcrumbPath.length - 1]
                    : undefined
                }
                onManageMode={onEnableManageMode}
                onBackToHome={onGoBackToHome}
                canManage
              />
            );
          }

          if (contentAvailability.emptyStateType === 'no-subcategories') {
            if (isManageMode) {
              return (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    background:
                      'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                    borderRadius: 3,
                    border: '2px dashed',
                    borderColor: '#ce93d8',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600, fontSize: '20px' }}
                    >
                      No Subcategories
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Create subcategories to organize your content.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateCategory}
                    id="create-subcategory-manage-btn"
                    sx={{
                      minWidth: 200,
                      background:
                        'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                      '&:hover': {
                        background:
                          'linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)',
                        boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
                      },
                    }}
                  >
                    Create Category
                  </Button>
                </Paper>
              );
            }

            return (
              <EmptyState
                type="no-subcategories"
                categoryName={
                  breadcrumbPath.length > 0
                    ? breadcrumbPath[breadcrumbPath.length - 1]
                    : undefined
                }
                onSwitchToResources={onSwitchToResources}
                onManageMode={onEnableManageMode}
                onBackToHome={onGoBackToHome}
                canManage
              />
            );
          }

          return (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 600, fontSize: '20px' }}
              >
                No Categories Found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 3 }}
              >
                No categories available at the moment.
              </Typography>
              <Button
                id="go-back-home-btn"
                variant="outlined"
                onClick={onGoBackToHome}
                size="large"
              >
                Go Back to Virtual Library
              </Button>
            </Paper>
          );
        })()
      ) : (
        <Grid container spacing={3}>
          {displayCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <CategoryCard
                category={category}
                onClick={onCategoryClick}
                isSelected={selectedCategoryId === category.id}
                isManageMode={isManageMode}
                onDelete={onDeleteCategory}
                onEdit={onEditCategory}
                onToggleFavorite={onToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default CategoriesView;
