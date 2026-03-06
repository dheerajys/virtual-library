/**
 * CategoryCard component for displaying library categories
 * Unified component that handles both normal and manage modes
 * Modern, beautiful design with enhanced visual appeal
 */

/* eslint-disable react/require-default-props */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Card, CardActionArea, Typography, Box, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { COLORS } from 'pvs-design-system';
import { ICategory } from '../../models';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

interface CategoryCardProps {
  category: ICategory;
  onClick: (categoryId: number) => void;
  isSelected?: boolean;
  isManageMode?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  isSelected = false,
  isManageMode = false,
  onDelete,
  onEdit,
  onToggleFavorite,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const resourceCount = category.resourceCount ?? 0;
  const categoryCount = category.categoryCount ?? 0;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(category.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(category.id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(category.id);
    }
  };

  const handleCardClick = () => {
    onClick(category.id);
  };

  const handleManageButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card click when clicking manage buttons
    action();
  };

  return (
    <>
      <Card
        elevation={isSelected ? 6 : 2}
        onClick={handleCardClick}
        sx={{
          height: '100%',
          minHeight: 180,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: isSelected
            ? `linear-gradient(135deg, ${COLORS.purple[700]} 0%, ${COLORS.purple[800]} 100%)`
            : '#ffffff',
          border: '2px solid',
          borderColor: 'transparent',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: 'none',
            borderColor: COLORS.purple[700],
            '& .folder-icon-container': {
              transform: 'scale(1.05)',
            },
            '& .favorite-btn': {
              opacity: 1,
            },
            ...(isManageMode && {
              '& .manage-actions': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            }),
          },
          '&:active': {
            transform: 'translateY(-3px)',
          },
        }}
      >
        {/* Favorite Star Button - Top Right */}
        {onToggleFavorite && (
          <IconButton
            id={`favorite-category-${category.id}`}
            className="favorite-btn"
            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: category.isFavorite ? 1 : 0.7,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'white',
                transform: 'scale(1.15) rotate(15deg)',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.4)',
              },
              '&:active': {
                transform: 'scale(1.05) rotate(0deg)',
              },
            }}
          >
            {category.isFavorite ? (
              <StarIcon
                sx={{
                  color: '#FFC107',
                  fontSize: 24,
                  filter: 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3))',
                }}
              />
            ) : (
              <StarBorderIcon
                sx={{
                  color: '#666',
                  fontSize: 24,
                }}
              />
            )}
          </IconButton>
        )}

        {/* Manage Actions - Bottom action bar (only shown in manage mode) */}
        {isManageMode && (
          <Box
            className="manage-actions"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              gap: 1,
              p: 1.5,
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.5))',
              backdropFilter: 'blur(8px)',
              borderRadius: '0 0 12px 12px',
              opacity: 0,
              transform: 'translateY(100%)',
              transition: 'all 0.3s ease',
              zIndex: 2,
            }}
          >
            <Box
              id="category-edit-btn"
              onClick={(e) => handleManageButtonClick(e, handleEditClick)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 1,
                px: 2,
                borderRadius: 1.5,
                bgcolor: 'rgba(114, 35, 98, 0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: COLORS.purple[700],
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
              Edit
            </Box>
            <Box
              id="category-delete-btn"
              onClick={(e) => handleManageButtonClick(e, handleDeleteClick)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                py: 1,
                px: 2,
                borderRadius: 1.5,
                bgcolor: 'rgba(211, 47, 47, 0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#d32f2f',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
              Delete
            </Box>
          </Box>
        )}

        <CardActionArea
          sx={{
            height: '100%',
            p: 2,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%',
            }}
          >
            {/* Icon Container - Outlined style */}
            <Box
              className="folder-icon-container"
              sx={{
                width: 60,
                height: 60,
                minWidth: 60,
                borderRadius: '50%',
                background: isSelected
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'rgba(114, 35, 98, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: 'none',
              }}
            >
              <FolderIcon
                sx={{
                  fontSize: 32,
                  color: isSelected ? 'white' : COLORS.purple[700],
                }}
              />
            </Box>

            {/* Category Details */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                overflow: 'hidden',
              }}
            >
              {/* Category Name */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: isSelected ? 'white' : '#000000',
                  wordBreak: 'break-word',
                  letterSpacing: '-0.01em',
                }}
              >
                {category.name}
              </Typography>

              {/* Metadata - Compact inline display */}
              {(resourceCount > 0 || categoryCount > 0) && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    flexWrap: 'wrap',
                  }}
                >
                  {resourceCount > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: isSelected
                          ? 'rgba(255, 255, 255, 0.95)'
                          : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      📄 {resourceCount}
                      {resourceCount === 1 ? ' Resource' : ' Resources'}
                    </Typography>
                  )}

                  {categoryCount > 0 && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: isSelected
                          ? 'rgba(255, 255, 255, 0.95)'
                          : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      📁 {categoryCount}
                      {categoryCount === 1 ? ' Category' : ' Categories'}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default CategoryCard;
