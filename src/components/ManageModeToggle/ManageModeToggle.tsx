/**
 * Toggle button to enable/disable manage mode
 */

import React from 'react';
import { Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useManageMode } from '../../contexts/ManageModeContext';

const ManageModeToggle: React.FC = () => {
  const { enableManageMode } = useManageMode();

  return (
    <Button
      id="manage-mode-toggle-btn"
      variant="outlined"
      startIcon={<SettingsIcon />}
      onClick={enableManageMode}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 1.5,
        borderColor: 'primary.main',
        color: 'primary.main',
        px: 2.5,
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 4px rgba(94, 53, 177, 0.15)',
        },
      }}
    >
      Manage Mode
    </Button>
  );
};

export default ManageModeToggle;
