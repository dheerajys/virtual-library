/**
 * Custom breadcrumbs component for navigation
 */

import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IBreadcrumb } from '../../models';

interface BreadcrumbsProps {
  items: IBreadcrumb[];
  onNavigate?: (categoryId: string | number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate = () => {},
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <Typography
                key={item.id}
                color="text.primary"
                sx={{ fontWeight: 600 }}
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <Box
              key={item.id}
              id={`breadcrumb-${item.id}`}
              component="button"
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
              sx={{
                cursor: 'pointer',
                color: 'primary.main',
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                margin: '-4px -8px',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '14px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(114, 35, 98, 0.08)',
                  color: 'primary.dark',
                },
              }}
            >
              {item.label}
            </Box>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

Breadcrumbs.defaultProps = {
  onNavigate: () => {},
};

export default Breadcrumbs;
