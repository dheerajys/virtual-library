/**
 * EmptyState component for displaying empty/no data states
 * Provides contextual messages and actions based on the type of empty state
 */

/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  SvgIconProps,
} from '@mui/material';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

export type EmptyStateType =
  | 'no-subcategories'
  | 'no-resources'
  | 'no-content'
  | 'no-search-results';

interface EmptyStateProps {
  type: EmptyStateType;
  categoryName?: string;
  onManageMode?: () => void;
  onSwitchToResources?: () => void;
  onClearSearch?: () => void;
  onBackToHome?: () => void;
  canManage?: boolean;
  searchTerm?: string;
}

interface EmptyStateConfig {
  icon: React.ComponentType<SvgIconProps>;
  title: string;
  message: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  categoryName = undefined,
  onManageMode = undefined,
  onSwitchToResources = undefined,
  onClearSearch = undefined,
  onBackToHome = undefined,
  canManage = true,
  searchTerm = undefined,
}) => {
  const getEmptyStateConfig = (): EmptyStateConfig => {
    switch (type) {
      case 'no-subcategories':
        return {
          icon: FolderOffIcon,
          title: 'No Subcategories Found',
          message: categoryName
            ? `There are currently no subcategories under "${categoryName}". ${
                canManage
                  ? 'Enable Manage Mode to create subcategories, or check the Resources tab to view available resources.'
                  : 'Check the Resources tab to view available resources for this category.'
              }`
            : 'There are currently no subcategories in this category. Check the Resources tab to view available resources.',
          actionLabel: 'View Resources',
          secondaryActionLabel: canManage ? 'Enter Manage Mode' : undefined,
        };

      case 'no-resources':
        return {
          icon: DescriptionIcon,
          title: 'No Resources Found',
          message: categoryName
            ? `There are currently no resources under "${categoryName}". ${
                canManage
                  ? 'You can add resources by entering Manage Mode.'
                  : 'Please check back later or browse other categories.'
              }`
            : 'There are currently no resources in this category.',
          actionLabel: canManage ? 'Enter Manage Mode' : undefined,
        };

      case 'no-content':
        return {
          icon: InfoOutlinedIcon,
          title: 'No Content Available',
          message: categoryName
            ? `The category "${categoryName}" is currently empty. ${
                canManage
                  ? 'Get started by creating subcategories or adding resources in Manage Mode.'
                  : 'Please check back later or browse other categories.'
              }`
            : 'This category is currently empty.',
          actionLabel: canManage ? 'Enter Manage Mode' : 'Go Back',
        };

      case 'no-search-results':
        return {
          icon: SearchOffIcon,
          title: 'No Results Found',
          message: searchTerm
            ? `No results found for "${searchTerm}". Try adjusting your search terms or filters.`
            : 'No results found. Try adjusting your search terms or filters.',
          actionLabel: 'Clear Search',
        };

      default:
        return {
          icon: InfoOutlinedIcon,
          title: 'No Data Available',
          message: 'There is no data to display at this time.',
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  // Determine which icon to use for the primary button
  const getButtonIcon = () => {
    if (type === 'no-subcategories') return <VisibilityIcon />;
    if (type === 'no-search-results') return <ClearIcon />;
    if (type === 'no-content' && !canManage) return <ArrowBackIcon />;
    return <SettingsIcon />;
  };

  const buttonIcon = getButtonIcon();

  const handlePrimaryAction = () => {
    if (type === 'no-subcategories' && onSwitchToResources) {
      onSwitchToResources();
    } else if (
      (type === 'no-resources' || type === 'no-content') &&
      onManageMode &&
      canManage
    ) {
      onManageMode();
    } else if (type === 'no-search-results' && onClearSearch) {
      onClearSearch();
    }
  };

  const handleSecondaryAction = () => {
    if (type === 'no-subcategories' && onManageMode && canManage) {
      onManageMode();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        borderRadius: 3,
        border: '2px dashed',
        borderColor: '#ce93d8',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #9c27b0 0%, #7b1fa2 100%)',
        },
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(156, 39, 176, 0.3)',
          }}
        >
          <IconComponent
            sx={{
              fontSize: 64,
              color: 'white',
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, color: 'text.primary', fontSize: '20px' }}
          >
            {config.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: '16px',
            }}
          >
            {config.message}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
        >
          {config.actionLabel && (
            <Button
              id="empty-state-primary-btn"
              variant="contained"
              size="large"
              onClick={handlePrimaryAction}
              startIcon={buttonIcon}
              sx={{
                minWidth: 200,
                bgcolor: '#7b1fa2',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
                '&:hover': {
                  bgcolor: '#6a1b9a',
                  boxShadow: '0 6px 16px rgba(123, 31, 162, 0.4)',
                },
              }}
            >
              {config.actionLabel}
            </Button>
          )}
          {config.secondaryActionLabel && (
            <Button
              id="empty-state-secondary-btn"
              variant="contained"
              size="large"
              onClick={handleSecondaryAction}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                minWidth: 200,
                bgcolor: '#7b1fa2',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
                '&:hover': {
                  bgcolor: '#6a1b9a',
                  boxShadow: '0 6px 16px rgba(123, 31, 162, 0.4)',
                },
              }}
            >
              {config.secondaryActionLabel}
            </Button>
          )}
          {onBackToHome && (
            <Button
              id="back-to-home-page-btn"
              variant="contained"
              size="large"
              onClick={onBackToHome}
              startIcon={<HomeIcon />}
              sx={{
                minWidth: 200,
                bgcolor: '#7b1fa2',
                color: 'white',
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(123, 31, 162, 0.3)',
                '&:hover': {
                  bgcolor: '#6a1b9a',
                  boxShadow: '0 6px 16px rgba(123, 31, 162, 0.4)',
                },
              }}
            >
              Back to Home Page
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EmptyState;
