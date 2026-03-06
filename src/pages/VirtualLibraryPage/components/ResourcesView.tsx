/**
 * Resources View Component
 * Displays resources grid with various states (loading, empty, search results)
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { IResource, ICategory } from '../../../models';
import { ResourceCard } from '../../../components/ResourceCard';
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

interface ResourcesViewProps {
  filteredResources: IResource[];
  activeCategory: ICategory | undefined;
  breadcrumbPath: string[];
  searchTerm: string;
  resourceTypesFilter: string[];
  isManageMode: boolean;
  contentAvailability: IContentAvailability;
  onBackToParent: () => void;
  onResetAll: () => void;
  onGoBackToHome: () => void;
  onEnableManageMode: () => void;
  onDeleteResource: (resourceId: number) => void;
  onEditResource: (resourceId: number) => void;
  onToggleFavorite: (resourceId: number) => void;
}

const ResourcesView: React.FC<ResourcesViewProps> = ({
  filteredResources,
  activeCategory,
  breadcrumbPath,
  searchTerm,
  resourceTypesFilter,
  isManageMode,
  contentAvailability,
  onBackToParent,
  onResetAll,
  onGoBackToHome,
  onEnableManageMode,
  onDeleteResource,
  onEditResource,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();

  const handleCreateResource = () => {
    navigate('/create-resource');
  };

  return (
    <>
      {/* Back button for resources view when in subcategory */}
      {breadcrumbPath.length > 0 && !searchTerm && (
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToParent}
            variant="outlined"
            id="back-to-categories-resources-btn"
          >
            Back to {breadcrumbPath.length > 1 ? 'Parent' : 'All Categories'}
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, mb: 0.5, fontSize: '24px' }}
          >
            {activeCategory ? activeCategory.name : 'All Resources'}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '16px' }}
          >
            {filteredResources.length}{' '}
            {filteredResources.length === 1 ? 'resource' : 'resources'}{' '}
            available
          </Typography>
        </Box>
        {isManageMode && (
          <Button
            id="create-resource-btn"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateResource}
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
            Create Resource
          </Button>
        )}
      </Box>

      {filteredResources.length === 0 ? (
        (() => {
          if (searchTerm || resourceTypesFilter.length > 0) {
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
            return (
              <EmptyState
                type="no-content"
                categoryName={activeCategory?.name}
                onManageMode={onEnableManageMode}
                onBackToHome={onGoBackToHome}
                canManage
              />
            );
          }

          if (contentAvailability.emptyStateType === 'no-resources') {
            return (
              <EmptyState
                type="no-resources"
                categoryName={activeCategory?.name}
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
                No Resources Found
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 3 }}
              >
                No resources match your current filters. Try adjusting your
                search criteria.
              </Typography>
              <Button
                id="reset-filters-btn"
                variant="contained"
                onClick={onResetAll}
                size="large"
              >
                Reset Filters
              </Button>
            </Paper>
          );
        })()
      ) : (
        <Grid container spacing={3}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={resource.id}>
              <ResourceCard
                resource={resource}
                isManageMode={isManageMode}
                onDelete={onDeleteResource}
                onEdit={onEditResource}
                onToggleFavorite={onToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ResourcesView;
