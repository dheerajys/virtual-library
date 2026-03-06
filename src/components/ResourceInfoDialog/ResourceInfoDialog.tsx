/**
 * Dialog to display resource details
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IResource } from '../../models/VirtualLibrary';
import { COLORS } from 'pvs-design-system';

interface ResourceInfoDialogProps {
  open: boolean;
  resource: IResource | null;
  onClose: () => void;
}

const ResourceInfoDialog: React.FC<ResourceInfoDialogProps> = ({
  open,
  resource,
  onClose,
}) => {
  if (!resource) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${COLORS.purple[700]} 0%, ${COLORS.purple[800]} 100%)`,
          color: 'white',
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <InfoIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '22px' }}>
              Resource Details
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 4, bgcolor: '#f8f9fa' }}>
        <Box sx={{ mt: 1 }}>
          {/* Resource Title with Icon */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <DescriptionIcon
                sx={{ fontSize: 40, color: COLORS.purple[700], mt: 0.5 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Title
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mt: 0.5, color: '#2c3e50', fontSize: '20px' }}
                >
                  {resource.title}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Resource Type */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CategoryIcon sx={{ fontSize: 28, color: COLORS.purple[700] }} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Type
                </Typography>
                <Chip
                  label={resource.type}
                  size="medium"
                  sx={{
                    bgcolor: COLORS.purple[700],
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 32,
                    '& .MuiChip-label': {
                      px: 2,
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Description */}
          {resource.description && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'block',
                  mb: 1.5,
                }}
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#34495e', lineHeight: 1.7 }}
              >
                {resource.description}
              </Typography>
            </Paper>
          )}

          {/* URL */}
          {resource.url && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <LinkIcon sx={{ fontSize: 28, color: COLORS.purple[700], mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    URL
                  </Typography>
                  <Box
                    component="a"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      color: COLORS.purple[700],
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <Typography variant="body2">{resource.url}</Typography>
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Status */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'white',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StarIcon
                sx={{
                  fontSize: 28,
                  color: resource.isFeatured ? '#ffd700' : 'text.secondary',
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    display: 'block',
                    mb: 1,
                  }}
                >
                  Status
                </Typography>
                <Chip
                  label={resource.isFeatured ? 'Featured' : 'Standard'}
                  icon={
                    resource.isFeatured ? (
                      <StarIcon sx={{ fontSize: 18, color: 'white !important' }} />
                    ) : undefined
                  }
                  size="medium"
                  sx={{
                    bgcolor: resource.isFeatured ? '#27ae60' : '#95a5a6',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    height: 32,
                    '& .MuiChip-label': {
                      px: 2,
                    },
                    '& .MuiChip-icon': {
                      ml: 1,
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 4,
          pb: 3,
          bgcolor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            background: `linear-gradient(135deg, ${COLORS.purple[700]} 0%, ${COLORS.purple[800]} 100%)`,
            boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
            '&:hover': {
              background: `linear-gradient(135deg, ${COLORS.purple[600]} 0%, ${COLORS.purple[700]} 100%)`,
              boxShadow: '0 6px 16px rgba(123, 31, 162, 0.4)',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceInfoDialog;
