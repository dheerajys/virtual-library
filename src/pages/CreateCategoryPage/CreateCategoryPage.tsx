/**
 * Create Category Page
 * Form for creating new categories with hierarchical location selection
 * Supports both create and edit modes
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Grid,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { COLORS } from 'pvs-design-system';
import { TreeSelect } from '../../components/TreeSelect';
import { MultiTreeSelect } from '../../components/MultiTreeSelect';
import { ICategoryFormData } from '../../models/Category';
import { ICategory } from '../../models';
import {
  ManageModeProvider,
  useManageMode,
} from '../../contexts/ManageModeContext';
import { mockLocationTree, locationIdMap } from '../../data/mockCategoryData';
import { RootState } from '../../store';
import {
  addCategory,
  updateCategory,
  navigateToHome,
  resetFilters,
} from '../../store/virtualLibrarySlice';

const CreateCategoryPageContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { disableManageMode } = useManageMode();
  const { breadcrumbPath, categories } = useSelector(
    (state: RootState) => state.virtualLibrary
  );

  // Check if we're in edit mode
  const isEditMode = !!id;
  const editCategory = location.state?.category as ICategory | undefined;

  // Helper function to convert location node ID back to numeric ID
  const getNumericLocationId = (nodeId: string): number => {
    // Find the numeric ID that maps to this node ID
    const entry = Object.entries(locationIdMap).find(
      ([, value]) => value === nodeId
    );
    return entry ? parseInt(entry[0], 10) : 1; // Default to 1 if not found
  };

  // Determine parent category from breadcrumb path
  const parentCategoryName =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1]
      : 'Home';

  // Find the actual parent category object
  const parentCategory =
    categories.find((cat) => cat.name === parentCategoryName) ||
    categories.find((cat) => cat.name === 'Home');

  const parentCategoryId = parentCategory?.id || 1;
  const parentLineage = parentCategory?.lineagePlusName || '/Home/';
  const parentDepth = parentCategory?.depth ?? 0;

  // Form state
  const [formData, setFormData] = useState<ICategoryFormData>({
    name: '',
    location: '',
    parentCategory: 'home',
    excludedLocations: [],
  });

  // Initialize form with edit data if in edit mode
  useEffect(() => {
    if (isEditMode && editCategory) {
      // Convert numeric idLocation to the location node ID
      const locationNodeId = editCategory.idLocation
        ? locationIdMap[editCategory.idLocation] || ''
        : '';

      setFormData({
        name: editCategory.name,
        location: locationNodeId,
        parentCategory: 'home',
        excludedLocations: [],
      });
    }
  }, [isEditMode, editCategory]);

  // Validation state
  const [errors, setErrors] = useState<
    Partial<Record<keyof ICategoryFormData, string>>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleLocationSelect = (locationId: string) => {
    setFormData({ ...formData, location: locationId });
    if (errors.location) {
      setErrors({ ...errors, location: undefined });
    }
  };

  const handleExcludedLocationsChange = (locations: string[]) => {
    setFormData({ ...formData, excludedLocations: locations });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ICategoryFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Category name must not exceed 50 characters';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to get button label
  const getSaveButtonLabel = () => {
    if (isSubmitting) return 'Saving...';
    return isEditMode ? 'Update' : 'Save';
  };

  const getSaveAndFinishButtonLabel = () => {
    if (isSubmitting) return 'Saving...';
    return isEditMode ? 'Update and Finish' : 'Save and Finish';
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editCategory) {
        // Update existing category
        const updatedCategory: ICategory = {
          ...editCategory,
          name: formData.name,
          idLocation: formData.location
            ? getNumericLocationId(formData.location)
            : editCategory.idLocation,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Update category in Redux state
        dispatch(updateCategory(updatedCategory));
      } else {
        // Create new category object
        const newCategory: ICategory = {
          id: Date.now(), // Use timestamp as temporary ID for demo
          name: formData.name,
          idParent: parentCategoryId, // Use actual parent category ID
          idLocation: formData.location
            ? getNumericLocationId(formData.location)
            : 1,
          lineage: parentLineage, // Use parent's lineagePlusName as this category's lineage
          depth: parentDepth + 1, // Increment parent's depth
          displayColumns: null,
          lineagePlusName: `${parentLineage}${formData.name}/`, // Append to parent lineage
          resourceCount: 0,
          categoryCount: 0,
          canModify: true,
          canDelete: true,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Add category to Redux state
        dispatch(addCategory(newCategory));
      }

      setShowSuccess(true);

      // Reset form after short delay (only for create mode)
      setTimeout(() => {
        if (!isEditMode) {
          setFormData({
            name: '',
            location: '',
            parentCategory: 'home',
            excludedLocations: [],
          });
        }
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving category:', error);
      setErrors({
        name: isEditMode
          ? 'Failed to update category. Please try again.'
          : 'Failed to create category. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save and finish
  const handleSaveAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editCategory) {
        // Update existing category
        const updatedCategory: ICategory = {
          ...editCategory,
          name: formData.name,
          idLocation: formData.location
            ? getNumericLocationId(formData.location)
            : editCategory.idLocation,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Update category in Redux state
        dispatch(updateCategory(updatedCategory));
      } else {
        // Create new category object
        const newCategory: ICategory = {
          id: Date.now(), // Use timestamp as temporary ID for demo
          name: formData.name,
          idParent: parentCategoryId, // Use actual parent category ID
          idLocation: formData.location
            ? getNumericLocationId(formData.location)
            : 1,
          lineage: parentLineage, // Use parent's lineagePlusName as this category's lineage
          depth: parentDepth + 1, // Increment parent's depth
          displayColumns: null,
          lineagePlusName: `${parentLineage}${formData.name}/`, // Append to parent lineage
          resourceCount: 0,
          categoryCount: 0,
          canModify: true,
          canDelete: true,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Add category to Redux state
        dispatch(addCategory(newCategory));
      }

      // Navigate to manage mode home with success message
      dispatch(navigateToHome());
      dispatch(resetFilters());
      navigate('/virtual-library', {
        state: {
          successMessage: isEditMode
            ? `Category "${formData.name}" updated successfully!`
            : `Category "${formData.name}" created successfully!`,
          enableManageMode: true,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving category:', error);
      setErrors({
        name: isEditMode
          ? 'Failed to update category. Please try again.'
          : 'Failed to create category. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Cancel returns to manage mode home
    dispatch(navigateToHome());
    dispatch(resetFilters());
    navigate('/virtual-library', {
      state: { enableManageMode: true },
    });
  };

  const handleBackToManageMode = () => {
    // Navigate to home and signal to enable manage mode
    dispatch(navigateToHome());
    dispatch(resetFilters());
    navigate('/virtual-library', {
      state: { enableManageMode: true },
    });
  };

  const handleExitManageMode = () => {
    // Disable manage mode, navigate to home, and reset filters
    disableManageMode();
    dispatch(navigateToHome());
    dispatch(resetFilters());
    navigate('/virtual-library');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Action Buttons */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, color: 'primary.main', fontSize: '26px' }}
            >
              {isEditMode ? 'Edit Category' : 'Create New Category'}
            </Typography>
            <InfoIcon color="primary" />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              id="back-to-manage-mode-btn"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToManageMode}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                px: 2.5,
                borderColor: COLORS.purple[700],
                color: COLORS.purple[700],
                bgcolor: COLORS.purple[50],
              }}
            >
              Manage Mode Home
            </Button>
            <Button
              id="exit-manage-mode-btn"
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              onClick={handleExitManageMode}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                borderColor: COLORS.purple[700],
                color: COLORS.purple[700],
                bgcolor: COLORS.purple[50],
                px: 2.5,
              }}
            >
              Exit Manage Mode
            </Button>
          </Box>
        </Box>

        {/* Warning Alert */}
        <Alert severity="warning" sx={{ mt: 2 }}>
          <strong>WARNING: You are in manage mode.</strong>
        </Alert>
      </Box>

      {/* Form */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Category Name */}
            <Grid item xs={12}>
              <TextField
                id="category-name-input"
                label="Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleNameChange}
                error={!!errors.name}
                helperText={
                  errors.name ||
                  'Create multiple categories at once. Ex: /Main Category/Subcategory (50 character limit per name)'
                }
                placeholder="Enter category name"
                disabled={isSubmitting}
                inputProps={{
                  maxLength: 50,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            {/* Location */}
            <Grid item xs={12}>
              <TreeSelect
                data={mockLocationTree}
                selectedId={formData.location}
                onSelect={handleLocationSelect}
                label="Location *"
                error={!!errors.location}
                helperText={errors.location}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Parent Category - Non-editable */}
            <Grid item xs={12}>
              <TextField
                id="parent-category-input"
                label="Parent Category"
                fullWidth
                required
                value={parentCategoryName}
                disabled
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
            </Grid>

            {/* Exclude from locations */}
            <Grid item xs={12}>
              <MultiTreeSelect
                data={mockLocationTree}
                selectedIds={formData.excludedLocations}
                onSelect={handleExcludedLocationsChange}
                label="Exclude from locations"
                helperText="Select locations where this category should not appear"
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            <Button
              id="save-category-btn"
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              {getSaveButtonLabel()}
            </Button>
            <Button
              id="save-and-finish-btn"
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveAndFinish}
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                bgcolor: COLORS.purple[700],
                '&:hover': {
                  bgcolor: COLORS.purple[800],
                },
              }}
            >
              {getSaveAndFinishButtonLabel()}
            </Button>
            <Button
              id="cancel-btn"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Help Text */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Need help?{' '}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Contact Support
          </Typography>
        </Typography>
      </Box>

      {/* Success Message Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            mt: 2,
            minWidth: 400,
          }}
        >
          {isEditMode
            ? 'Category updated successfully!'
            : 'Category created successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Wrap the content component with ManageModeProvider
// eslint-disable-next-line react/no-multi-comp
const CreateCategoryPage: React.FC = () => {
  return (
    <ManageModeProvider>
      <CreateCategoryPageContent />
    </ManageModeProvider>
  );
};

export default CreateCategoryPage;
