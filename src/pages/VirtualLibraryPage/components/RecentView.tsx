/**
 * RecentView component
 * Displays recently visited categories and resources
 */

/* eslint-disable react/require-default-props */
import React, { useMemo } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { COLORS } from 'pvs-design-system';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import {
  clearRecentItems,
  navigateToRecentItem,
} from '../../../store/virtualLibrarySlice';
import { CategoryCard } from '../../../components/CategoryCard';
import CategoryManageCard from '../../../components/CategoryManageCard/CategoryManageCard';
import { ResourceCard } from '../../../components/ResourceCard';
import ResourceManageCard from '../../../components/ResourceManageCard/ResourceManageCard';
import { ICategory, IResource } from '../../../models';

interface RecentViewProps {
  isManageMode: boolean;
  onResourceClick?: (resource: IResource) => void;
  onDeleteCategory?: (categoryId: number) => void;
  onEditCategory?: (categoryId: number) => void;
  onDeleteResource?: (resourceId: number) => void;
  onEditResource?: (resourceId: number) => void;
  onToggleCategoryFavorite: (categoryId: number) => void;
  onToggleResourceFavorite: (resourceId: number) => void;
  setViewMode: (mode: 'categories' | 'resources') => void;
}

const RecentView: React.FC<RecentViewProps> = ({
  isManageMode,
  onResourceClick,
  onDeleteCategory,
  onEditCategory,
  onDeleteResource,
  onEditResource,
  onToggleCategoryFavorite,
  onToggleResourceFavorite,
  setViewMode,
}) => {
  const dispatch = useDispatch();
  const { recentItems, categories, resources } = useSelector(
    (state: RootState) => state.virtualLibrary
  );

  // Get actual category and resource objects from IDs
  const recentItemsData = useMemo(() => {
    return recentItems
      .map((item) => {
        if (item.type === 'category') {
          const category = categories.find((c) => c.id === item.id);
          return category ? { ...item, data: category } : null;
        }
        const resource = resources.find((r) => r.id === item.id);
        return resource ? { ...item, data: resource } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [recentItems, categories, resources]);

  const handleClearRecent = () => {
    dispatch(clearRecentItems());
  };

  /**
   * Handle clicking on a recent item - navigate with breadcrumb path restoration
   */
  const handleRecentItemClick = (
    id: number,
    type: 'category' | 'resource',
    breadcrumbPath: string[]
  ) => {
    dispatch(
      navigateToRecentItem({
        id,
        type,
        breadcrumbPath,
      })
    );
    // Switch to categories view for navigation
    setViewMode('categories');
  };

  if (recentItemsData.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          textAlign: 'center',
        }}
      >
        <HistoryIcon sx={{ fontSize: 64, color: COLORS.purple[400], mb: 2 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
        >
          No Recent Items
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Items you visit will appear here for quick access
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with clear button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <HistoryIcon sx={{ fontSize: 28, color: COLORS.purple[700] }} />
          Recently Visited
        </Typography>

        <Button
          id="clear-recent-btn"
          variant="outlined"
          size="small"
          startIcon={<DeleteSweepIcon />}
          onClick={handleClearRecent}
          sx={{
            borderColor: COLORS.purple[700],
            color: COLORS.purple[700],
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': {
              borderColor: COLORS.purple[800],
              bgcolor: 'rgba(114, 35, 98, 0.04)',
            },
          }}
        >
          Clear History
        </Button>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 4,
          fontSize: '16px',
        }}
      >
        {recentItemsData.length} item{recentItemsData.length !== 1 ? 's' : ''}{' '}
        visited recently
      </Typography>

      {/* Recent Items Grid */}
      <Grid container spacing={3}>
        {recentItemsData.map((item) => {
          if (item.type === 'category') {
            const category = item.data as ICategory;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`cat-${category.id}`}
              >
                {isManageMode ? (
                  <CategoryManageCard
                    category={category}
                    onClick={() =>
                      handleRecentItemClick(
                        category.id,
                        'category',
                        item.breadcrumbPath
                      )
                    }
                    onDelete={
                      onDeleteCategory
                        ? () => onDeleteCategory(category.id)
                        : undefined
                    }
                    onEdit={
                      onEditCategory
                        ? () => onEditCategory(category.id)
                        : undefined
                    }
                    onToggleFavorite={() =>
                      onToggleCategoryFavorite(category.id)
                    }
                  />
                ) : (
                  <CategoryCard
                    category={category}
                    onClick={() =>
                      handleRecentItemClick(
                        category.id,
                        'category',
                        item.breadcrumbPath
                      )
                    }
                    onToggleFavorite={() =>
                      onToggleCategoryFavorite(category.id)
                    }
                  />
                )}
              </Grid>
            );
          }
          const resource = item.data as IResource;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`res-${resource.id}`}>
              {isManageMode ? (
                <ResourceManageCard
                  resource={resource}
                  onClick={
                    onResourceClick
                      ? () => onResourceClick(resource)
                      : undefined
                  }
                  onDelete={
                    onDeleteResource
                      ? () => onDeleteResource(resource.id)
                      : undefined
                  }
                  onEdit={
                    onEditResource
                      ? () => onEditResource(resource.id)
                      : undefined
                  }
                  onToggleFavorite={() => onToggleResourceFavorite(resource.id)}
                />
              ) : (
                <ResourceCard
                  resource={resource}
                  onClick={
                    onResourceClick
                      ? () => onResourceClick(resource)
                      : undefined
                  }
                  onToggleFavorite={() => onToggleResourceFavorite(resource.id)}
                />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default RecentView;
