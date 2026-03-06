/**
 * Notification Snackbars Component
 * Displays various notifications (success, info, warnings)
 */
import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface NotificationSnackbarsProps {
  successMessage: string | null;
  showMockDataAlert: boolean;
  showNoCategoriesNotification: boolean;
  showNoResourcesNotification: boolean;
  onCloseSuccess: () => void;
  onCloseMockData: () => void;
  onCloseNoCategories: () => void;
  onCloseNoResources: () => void;
}

const NotificationSnackbars: React.FC<NotificationSnackbarsProps> = ({
  successMessage,
  showMockDataAlert,
  showNoCategoriesNotification,
  showNoResourcesNotification,
  onCloseSuccess,
  onCloseMockData,
  onCloseNoCategories,
  onCloseNoResources,
}) => {
  return (
    <>
      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={onCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseSuccess}
          severity="success"
          variant="filled"
          sx={{
            mt: 2,
            minWidth: 400,
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Mock Data Alert */}
      <Snackbar
        open={showMockDataAlert}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') {
            return;
          }
          onCloseMockData();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseMockData}
          severity="info"
          icon={<InfoIcon />}
          sx={{
            mt: 2,
            width: '100%',
            '& .MuiAlert-action': {
              alignItems: 'center',
              paddingTop: 0,
            },
          }}
        >
          Using mock data - API connection unavailable
        </Alert>
      </Snackbar>

      {/* No Subcategories Notification */}
      <Snackbar
        open={showNoCategoriesNotification}
        autoHideDuration={5000}
        onClose={onCloseNoCategories}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseNoCategories}
          severity="info"
          variant="filled"
          sx={{ minWidth: 400, mt: 2 }}
        >
          No subcategories exist for this category. Showing available resources
          instead.
        </Alert>
      </Snackbar>

      {/* No Resources Notification */}
      <Snackbar
        open={showNoResourcesNotification}
        autoHideDuration={5000}
        onClose={onCloseNoResources}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={onCloseNoResources}
          severity="info"
          variant="filled"
          sx={{ minWidth: 400, mt: 2 }}
        >
          No resources exist for this category. Showing available categories
          instead.
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationSnackbars;
