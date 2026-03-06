/**
 * Page Header Component
 * Displays the Virtual Library title, description, and manage mode controls
 */
import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { COLORS } from 'pvs-design-system';
import ManageModeToggle from '../../../components/ManageModeToggle';

interface PageHeaderProps {
  isManageMode: boolean;
  viewMode: 'categories' | 'resources';
  onExitManageMode: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  isManageMode,
  viewMode,
  onExitManageMode,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LocalLibraryIcon
              sx={{
                fontSize: 36,
                color: COLORS.purple[700],
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: COLORS.purple[700],
                fontSize: '28px',
              }}
            >
              Virtual Library
            </Typography>
          </Box>
        </Box>
        {!isManageMode ? (
          <ManageModeToggle />
        ) : (
          <Button
            id="exit-manage-mode-btn"
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={onExitManageMode}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              borderColor: COLORS.purple[700],
              color: COLORS.purple[700],
              bgcolor: COLORS.purple[50],
              px: 2.5,
              fontSize: '16px',
            }}
          >
            Exit Manage Mode
          </Button>
        )}
      </Box>
      {isManageMode && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          WARNING: You are in manage mode.
        </Alert>
      )}
      <Typography
        variant="subtitle1"
        color="text.secondary"
        paragraph
        sx={{ fontSize: '16px' }}
      >
        {(() => {
          if (isManageMode) {
            return viewMode === 'categories'
              ? 'Create new categories, edit existing ones, or delete them. Hover over any category card to reveal management options.'
              : 'Create new resources, edit existing ones, or delete them. Hover over any resource card to reveal management options.';
          }
          return viewMode === 'categories'
            ? 'Browse through our comprehensive collection of resources, documents, and guides organized by category'
            : 'Explore the resources within this category. Click on any resource to open it in a new tab.';
        })()}
      </Typography>
    </Box>
  );
};

export default PageHeader;
