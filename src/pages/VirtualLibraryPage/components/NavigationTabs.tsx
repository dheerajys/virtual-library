/**
 * Navigation Tabs Component
 * Card-style tabs for switching between Categories, Resources, and Recent views
 */
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import {
  ViewModule as ViewModuleIcon,
  List as ListIcon,
  ClearAll as ClearAllIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { COLORS } from 'pvs-design-system';

type ViewMode = 'categories' | 'resources' | 'recent';

interface NavigationTabsProps {
  viewMode: ViewMode;
  resourceCount: number;
  recentCount: number;
  hasActiveFilters: boolean;
  onTabChange: (event: React.SyntheticEvent, newValue: ViewMode) => void;
  onResetAll: () => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  viewMode,
  resourceCount,
  recentCount,
  hasActiveFilters,
  onTabChange,
  onResetAll,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        py: 2.5,
        bgcolor: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
      }}
    >
      {/* Card-Style Tab Group */}
      <Box
        sx={{
          display: 'inline-flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Categories Tab - Card Style */}
        <Box
          onClick={() => onTabChange({} as React.SyntheticEvent, 'categories')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3.5,
            py: 2,
            borderRadius: 3,
            cursor: 'pointer',
            border: '2px solid',
            borderColor:
              viewMode === 'categories' ? COLORS.purple[700] : '#e1e4e8',
            bgcolor: viewMode === 'categories' ? COLORS.purple[700] : '#ffffff',
            color: viewMode === 'categories' ? '#ffffff' : 'text.primary',
            boxShadow:
              viewMode === 'categories'
                ? '0 4px 12px rgba(114, 35, 98, 0.25), 0 2px 4px rgba(114, 35, 98, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 180,
            '&:hover': {
              borderColor: COLORS.purple[700],
              bgcolor:
                viewMode === 'categories' ? COLORS.purple[800] : '#fafbfc',
              transform: 'translateY(-2px)',
              boxShadow:
                viewMode === 'categories'
                  ? '0 6px 16px rgba(114, 35, 98, 0.3), 0 3px 6px rgba(114, 35, 98, 0.2)'
                  : '0 4px 8px rgba(114, 35, 98, 0.15)',
            },
          }}
        >
          <ViewModuleIcon
            sx={{
              fontSize: 24,
              color: viewMode === 'categories' ? '#ffffff' : COLORS.purple[700],
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: viewMode === 'categories' ? '#ffffff' : COLORS.purple[700],
            }}
          >
            Categories
          </Typography>
        </Box>

        {/* Resources Tab - Card Style */}
        <Box
          onClick={() => onTabChange({} as React.SyntheticEvent, 'resources')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3.5,
            py: 2,
            borderRadius: 3,
            cursor: 'pointer',
            border: '2px solid',
            borderColor:
              viewMode === 'resources' ? COLORS.purple[700] : '#e1e4e8',
            bgcolor: viewMode === 'resources' ? COLORS.purple[700] : '#ffffff',
            color: viewMode === 'resources' ? '#ffffff' : 'text.primary',
            boxShadow:
              viewMode === 'resources'
                ? '0 4px 12px rgba(114, 35, 98, 0.25), 0 2px 4px rgba(114, 35, 98, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 180,
            '&:hover': {
              borderColor: COLORS.purple[700],
              bgcolor:
                viewMode === 'resources' ? COLORS.purple[800] : '#fafbfc',
              transform: 'translateY(-2px)',
              boxShadow:
                viewMode === 'resources'
                  ? '0 6px 16px rgba(114, 35, 98, 0.3), 0 3px 6px rgba(114, 35, 98, 0.2)'
                  : '0 4px 8px rgba(114, 35, 98, 0.15)',
            },
          }}
        >
          <ListIcon
            sx={{
              fontSize: 24,
              color: viewMode === 'resources' ? '#ffffff' : COLORS.purple[700],
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: viewMode === 'resources' ? '#ffffff' : COLORS.purple[700],
            }}
          >
            Resources
          </Typography>
          <Box
            component="span"
            sx={{
              bgcolor:
                viewMode === 'resources'
                  ? 'rgba(255, 255, 255, 0.25)'
                  : COLORS.purple[700],
              color: '#ffffff',
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.85rem',
              fontWeight: 800,
              minWidth: 32,
              textAlign: 'center',
              letterSpacing: '0.02em',
              boxShadow:
                viewMode === 'resources'
                  ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                  : '0 2px 4px rgba(114, 35, 98, 0.2)',
            }}
          >
            {resourceCount}
          </Box>
        </Box>

        {/* Recent Tab - Card Style */}
        <Box
          onClick={() => onTabChange({} as React.SyntheticEvent, 'recent')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3.5,
            py: 2,
            borderRadius: 3,
            cursor: 'pointer',
            border: '2px solid',
            borderColor: viewMode === 'recent' ? COLORS.purple[700] : '#e1e4e8',
            bgcolor: viewMode === 'recent' ? COLORS.purple[700] : '#ffffff',
            color: viewMode === 'recent' ? '#ffffff' : 'text.primary',
            boxShadow:
              viewMode === 'recent'
                ? '0 4px 12px rgba(114, 35, 98, 0.25), 0 2px 4px rgba(114, 35, 98, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            minWidth: 180,
            '&:hover': {
              borderColor: COLORS.purple[700],
              bgcolor: viewMode === 'recent' ? COLORS.purple[800] : '#fafbfc',
              transform: 'translateY(-2px)',
              boxShadow:
                viewMode === 'recent'
                  ? '0 6px 16px rgba(114, 35, 98, 0.3), 0 3px 6px rgba(114, 35, 98, 0.2)'
                  : '0 4px 8px rgba(114, 35, 98, 0.15)',
            },
          }}
        >
          <HistoryIcon
            sx={{
              fontSize: 24,
              color: viewMode === 'recent' ? '#ffffff' : COLORS.purple[700],
            }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: viewMode === 'recent' ? '#ffffff' : COLORS.purple[700],
            }}
          >
            Recent
          </Typography>
          {recentCount > 0 && (
            <Box
              component="span"
              sx={{
                bgcolor:
                  viewMode === 'recent'
                    ? 'rgba(255, 255, 255, 0.25)'
                    : COLORS.purple[700],
                color: '#ffffff',
                px: 1.25,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.85rem',
                fontWeight: 800,
                minWidth: 32,
                textAlign: 'center',
                letterSpacing: '0.02em',
                boxShadow:
                  viewMode === 'recent'
                    ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                    : '0 2px 4px rgba(114, 35, 98, 0.2)',
              }}
            >
              {recentCount}
            </Box>
          )}
        </Box>
      </Box>

      {/* Clear Filters Button - Modern Outline Style */}
      {hasActiveFilters && (
        <Button
          id="clear-all-filters-btn"
          startIcon={<ClearAllIcon sx={{ fontSize: 20 }} />}
          onClick={onResetAll}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '16px',
            borderRadius: 2.5,
            px: 3,
            py: 1.5,
            border: `2px solid ${COLORS.purple[700]}`,
            color: '#ffffff',
            bgcolor: COLORS.purple[700],
            boxShadow: '0 2px 4px rgba(114, 35, 98, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(114, 35, 98, 0.3)',
            },
          }}
        >
          Clear Filters
        </Button>
      )}
    </Box>
  );
};

export default NavigationTabs;
