/**
 * LoadingState component - Modern skeleton loader for different content types
 */

import React from 'react';
import { Box, Grid, Skeleton, Paper } from '@mui/material';

interface LoadingStateProps {
  type: 'categories' | 'resources';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ type, count = 8 }) => {
  const skeletonKeys = React.useMemo(
    () =>
      Array.from(
        { length: count },
        (_, i) => `${type}-skeleton-${i}-${Date.now()}`
      ),
    [count, type]
  );

  if (type === 'categories') {
    return (
      <Grid container spacing={3}>
        {skeletonKeys.map((key) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                borderRadius: 2,
                transition: 'none',
              }}
            >
              {/* Icon skeleton */}
              <Skeleton
                variant="circular"
                width={48}
                height={48}
                sx={{ bgcolor: 'grey.200' }}
              />

              {/* Title skeleton */}
              <Skeleton
                variant="text"
                width="80%"
                height={32}
                sx={{ bgcolor: 'grey.200' }}
              />

              {/* Subtitle skeleton */}
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                sx={{ bgcolor: 'grey.200' }}
              />

              {/* Stats skeleton */}
              <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  sx={{ bgcolor: 'grey.200' }}
                />
                <Skeleton
                  variant="text"
                  width={80}
                  height={20}
                  sx={{ bgcolor: 'grey.200' }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Resources skeleton
  return (
    <Grid container spacing={3}>
      {skeletonKeys.map((key) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
          <Paper
            elevation={2}
            sx={{
              height: 240,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'none',
            }}
          >
            <Box
              sx={{
                p: 2.5,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Type badge skeleton */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}
              >
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  sx={{ bgcolor: 'grey.200' }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  sx={{ bgcolor: 'grey.200' }}
                />
              </Box>

              {/* Title skeleton */}
              <Skeleton
                variant="text"
                width="90%"
                height={28}
                sx={{ mb: 1, bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={28}
                sx={{ mb: 1.5, bgcolor: 'grey.200' }}
              />

              {/* Description skeleton */}
              <Skeleton
                variant="text"
                width="100%"
                height={20}
                sx={{ bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width="95%"
                height={20}
                sx={{ bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

LoadingState.defaultProps = {
  count: 8,
};

export default LoadingState;
