/**
 * Resource card with manage mode actions (edit/delete/more info)
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { COLORS } from 'pvs-design-system';
import { IResource, ResourceType } from '../../models';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';
import ResourceInfoDialog from '../ResourceInfoDialog';
import { useManageMode } from '../../contexts/ManageModeContext';

interface ResourceManageCardProps {
  resource: IResource;
  onClick?: (resource: IResource) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

/**
 * Get the appropriate icon for a resource type
 */
const getResourceIcon = (type: ResourceType) => {
  const iconProps = { sx: { fontSize: 32 } };

  switch (type) {
    case ResourceType.PDF:
      return <PictureAsPdfIcon {...iconProps} />;
    case ResourceType.DOC:
    case ResourceType.DOCX:
      return <DescriptionIcon {...iconProps} />;
    case ResourceType.XLS:
    case ResourceType.XLSX:
      return <InsertDriveFileIcon {...iconProps} />;
    case ResourceType.PPT:
    case ResourceType.PPTX:
      return <InsertDriveFileIcon {...iconProps} />;
    case ResourceType.TXT:
      return <DescriptionIcon {...iconProps} />;
    case ResourceType.Link:
      return <LinkIcon {...iconProps} />;
    case ResourceType.Other:
    default:
      return <InsertDriveFileIcon {...iconProps} />;
  }
};

/**
 * Get a display-friendly label for resource type
 */
const getResourceTypeLabel = (type: ResourceType): string => {
  if (type === ResourceType.Link) return 'Link';
  return type.toUpperCase();
};

const ResourceManageCard: React.FC<ResourceManageCardProps> = ({
  resource,
  onClick,
  onDelete,
  onEdit,
  onToggleFavorite,
}) => {
  const { isManageMode } = useManageMode();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(resource.id);
    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(resource.id);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(resource.id);
    }
  };

  const handleInfoClick = () => {
    setInfoDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoDialogOpen(false);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(resource);
    } else {
      // Default behavior: open the URL
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleManageButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // Prevent card click when clicking manage buttons
    action();
  };

  const isPDF = resource.type === ResourceType.PDF;
  const typeColor = isPDF ? '#8a9199' : COLORS.purple[700];
  const iconColor = '#ffffff';
  const badgeColor = isPDF ? '#d32f2f' : COLORS.purple[700];
  const typeLabel = getResourceTypeLabel(resource.type);

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          minHeight: 220,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
          border: '2px solid',
          borderColor: 'transparent',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: `0 12px 24px ${isPDF ? 'rgba(211, 47, 47, 0.15)' : 'rgba(114, 35, 98, 0.15)'}`,
            borderColor: typeColor,
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            '& .resource-icon-container': {
              transform: 'scale(1.1)',
              boxShadow: `0 8px 16px ${isPDF ? 'rgba(211, 47, 47, 0.3)' : 'rgba(114, 35, 98, 0.3)'}`,
            },
            '& .manage-actions': {
              opacity: 1,
              transform: 'translateY(0)',
            },
            '& .favorite-btn': {
              opacity: 1,
            },
          },
          '&:active': {
            transform: 'translateY(-4px) scale(1.01)',
          },
        }}
      >
        {/* Favorite Star Button - Top Right */}
        {onToggleFavorite && (
          <IconButton
            className="favorite-btn"
            onClick={(e) => handleManageButtonClick(e, handleToggleFavorite)}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 3,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: resource.isFavorite ? 1 : 0.7,
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
            {resource.isFavorite ? (
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

        {/* Manage Actions - Bottom action bar */}
        {isManageMode && (
          <Box
            className="manage-actions"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              gap: 0.75,
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
              id="resource-more-info-btn"
              onClick={(e) => handleManageButtonClick(e, handleInfoClick)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 0.75,
                px: 1,
                borderRadius: 1.5,
                bgcolor: 'rgba(2, 136, 209, 0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#0288d1',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <InfoIcon sx={{ fontSize: 16 }} />
              Info
            </Box>
            <Box
              id="resource-edit-btn"
              onClick={(e) => handleManageButtonClick(e, handleEditClick)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 0.75,
                px: 1,
                borderRadius: 1.5,
                bgcolor: 'rgba(114, 35, 98, 0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: COLORS.purple[700],
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
              Edit
            </Box>
            <Box
              id="resource-delete-btn"
              onClick={(e) => handleManageButtonClick(e, handleDeleteClick)}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                py: 0.75,
                px: 1,
                borderRadius: 1.5,
                bgcolor: 'rgba(211, 47, 47, 0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#d32f2f',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
              Delete
            </Box>
          </Box>
        )}

        <CardActionArea onClick={handleCardClick} sx={{ height: '100%', p: 3 }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
            {/* Type Badge and Icon */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
              <Box
                className="resource-icon-container"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2.5,
                  background: `linear-gradient(135deg, ${typeColor} 0%, ${isPDF ? '#6b7380' : COLORS.purple[800]} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px ${isPDF ? 'rgba(138, 145, 153, 0.25)' : 'rgba(114, 35, 98, 0.25)'}`,
                }}
              >
                <Box sx={{ color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getResourceIcon(resource.type)}
                </Box>
              </Box>
              
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  background: `${badgeColor}15`,
                  border: `1.5px solid ${badgeColor}40`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                    color: badgeColor,
                  }}
                >
                  {typeLabel}
                </Typography>
              </Box>
            </Box>

            {/* Resource Name */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: 1.4,
                color: '#2d3748',
                mb: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '2.8em',
              }}
            >
              {resource.name}
            </Typography>

            {/* Resource Description */}
            {resource.description && (
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  color: '#718096',
                  fontSize: '16px',
                  lineHeight: 1.5,
                }}
              >
                {resource.description}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resource.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Resource Info Dialog */}
      <ResourceInfoDialog
        open={infoDialogOpen}
        resource={resource}
        onClose={handleCloseInfo}
      />
    </>
  );
};

export default ResourceManageCard;
