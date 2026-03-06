import React from 'react';
import { Box, Typography, IconButton, Collapse } from '@mui/material';
import { Star, ExpandMore } from '@mui/icons-material';
import { ICategory, IResource } from '../../models';
import { CategoryCard } from '../CategoryCard';
import { ResourceCard } from '../ResourceCard';

interface QuickAccessSectionProps {
  favoriteCategories: ICategory[];
  favoriteResources: IResource[];
  onCategoryClick: (categoryId: number) => void;
  onResourceClick: (resource: IResource) => void;
  onToggleCategoryFavorite: (categoryId: number) => void;
  onToggleResourceFavorite: (resourceId: number) => void;
}

/**
 * QuickAccessSection component displays favorited categories and resources
 * at the top of the Virtual Library page for easy access
 */
const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({
  favoriteCategories,
  favoriteResources,
  onCategoryClick,
  onResourceClick,
  onToggleCategoryFavorite,
  onToggleResourceFavorite,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const totalFavorites = favoriteCategories.length + favoriteResources.length;

  // Don't render if no favorites
  if (totalFavorites === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)',
        border: '1px solid',
        borderColor: 'rgba(156, 39, 176, 0.25)',
        boxShadow: '0 2px 8px rgba(156, 39, 176, 0.12)',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(156, 39, 176, 0.18)',
          borderColor: 'rgba(156, 39, 176, 0.35)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: isExpanded ? 2.5 : 0,
          cursor: 'pointer',
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Star
            sx={{
              color: '#FFC107',
              fontSize: 26,
              filter: 'drop-shadow(0 1px 3px rgba(255, 193, 7, 0.3))',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#9C27B0',
              letterSpacing: '-0.01em',
              fontSize: '22px',
            }}
          >
            Quick Access
          </Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 12,
              backgroundColor: '#9C27B0',
              boxShadow: '0 2px 4px rgba(156, 39, 176, 0.2)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {totalFavorites} {totalFavorites === 1 ? 'item' : 'items'}
            </Typography>
          </Box>
        </Box>
        <IconButton
          id="quick-access-toggle"
          size="small"
          sx={{
            color: '#9C27B0',
            transition: 'transform 0.3s ease',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            '&:hover': {
              backgroundColor: 'rgba(156, 39, 176, 0.08)',
            },
          }}
        >
          <ExpandMore />
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={isExpanded} timeout={300}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            overflowY: 'visible',
            pb: 2,
            pt: 1,
            mx: -0.5,
            px: 0.5,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(156, 39, 176, 0.05)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(156, 39, 176, 0.3)',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.5)',
              },
            },
          }}
        >
          {/* Favorite Categories */}
          {favoriteCategories.map((category) => (
            <Box
              key={`fav-cat-${category.id}`}
              sx={{
                minWidth: 280,
                maxWidth: 320,
                flexShrink: 0,
              }}
            >
              <CategoryCard
                category={category}
                onClick={() => onCategoryClick(category.id)}
                onToggleFavorite={onToggleCategoryFavorite}
              />
            </Box>
          ))}

          {/* Favorite Resources */}
          {favoriteResources.map((resource) => (
            <Box
              key={`fav-res-${resource.id}`}
              sx={{
                minWidth: 280,
                maxWidth: 320,
                flexShrink: 0,
              }}
            >
              <ResourceCard
                resource={resource}
                onClick={() => onResourceClick(resource)}
                onToggleFavorite={onToggleResourceFavorite}
              />
            </Box>
          ))}
        </Box>

        {/* Empty state message (shown when section is expanded but shouldn't be visible) */}
        {totalFavorites === 0 && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No favorites yet. Star items for quick access!
            </Typography>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default QuickAccessSection;
