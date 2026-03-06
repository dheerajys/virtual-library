/* eslint-disable react/jsx-wrap-multilines */
/**
 * Create Resource Page
 * Form for creating new resources with hierarchical category selection
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
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
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
import { IResourceFormData } from '../../models/Resource';
import { IResource, ResourceType } from '../../models';
import {
  ManageModeProvider,
  useManageMode,
} from '../../contexts/ManageModeContext';
import { mockLocationTree } from '../../data/mockCategoryData';
import { RootState } from '../../store';
import {
  navigateToHome,
  resetFilters,
  addResource,
  updateResource,
} from '../../store/virtualLibrarySlice';

const CreateResourcePageContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { disableManageMode } = useManageMode();
  const { breadcrumbPath, categories, selectedCategoryId } = useSelector(
    (state: RootState) => state.virtualLibrary
  );

  // Check if we're in edit mode
  const isEditMode = !!id;
  const editResource = location.state?.resource as IResource | undefined;

  // Determine parent category from breadcrumb path
  const parentCategoryName =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1]
      : 'Home';

  // Find the actual parent category object
  const parentCategory =
    categories.find((cat) => cat.name === parentCategoryName) ||
    categories.find((cat) => cat.name === 'Home');

  // Use selectedCategoryId if available (for leaf categories), otherwise use parent category ID
  const targetCategoryId = selectedCategoryId || parentCategory?.id || 1;

  // Form state
  const [formData, setFormData] = useState<IResourceFormData>({
    name: '',
    description: '',
    resourceType: 'url',
    url: '',
    file: null,
    location: '',
    parentCategory: 'home',
    excludedLocations: [],
    isPublic: true,
    isCascading: false,
  });

  // Initialize form with edit data if in edit mode
  useEffect(() => {
    if (isEditMode && editResource) {
      // Convert numeric idLocation to the location node ID (if applicable)
      const locationNodeId = '';

      setFormData({
        name: editResource.name,
        description: editResource.description || '',
        resourceType: 'url',
        url: editResource.url,
        file: null,
        location: locationNodeId,
        parentCategory: 'home',
        excludedLocations: [],
        isPublic: editResource.isPublic,
        isCascading: editResource.isCascading,
      });
    }
  }, [isEditMode, editResource]);

  // Validation state
  const [errors, setErrors] = useState<
    Partial<Record<keyof IResourceFormData, string>>
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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, description: e.target.value });
    if (errors.description) {
      setErrors({ ...errors, description: undefined });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, url: e.target.value });
    if (errors.url) {
      setErrors({ ...errors, url: undefined });
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

  const handleIsPublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isPublic: e.target.checked });
  };

  const handleIsCascadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isCascading: e.target.checked });
  };

  const handleResourceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newResourceType = e.target.value as 'url' | 'file';
    setFormData({
      ...formData,
      resourceType: newResourceType,
      // Clear the opposite field when switching types
      url: newResourceType === 'url' ? formData.url : '',
      file: newResourceType === 'file' ? formData.file : null,
    });
    // Clear any validation errors for url/file when switching types
    if (errors.url) {
      setErrors({ ...errors, url: undefined });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFormData({ ...formData, file: selectedFile });
    if (errors.url) {
      // Using 'url' error key for file validation too
      setErrors({ ...errors, url: undefined });
    }
  };

  // URL validation helper
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof IResourceFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Resource name must not exceed 100 characters';
    }

    // Validate based on resource type
    if (formData.resourceType === 'url') {
      if (!formData.url.trim()) {
        newErrors.url = 'URL is required';
      } else if (!isValidUrl(formData.url)) {
        newErrors.url = 'Please enter a valid URL';
      }
    }

    // File type validation
    if (formData.resourceType === 'file') {
      if (!formData.file) {
        newErrors.url = 'Please select a file'; // Using 'url' key for simplicity
      } else if (formData.file.size > 100 * 1024 * 1024) {
        // 100MB limit
        newErrors.url = 'File size must not exceed 100MB';
      }
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

  // Handle form submission (Save button - stays on page with success message)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editResource) {
        // Update existing resource
        const updatedResource: IResource = {
          ...editResource,
          name: formData.name,
          description: formData.description || null,
          url: formData.url,
          isPublic: formData.isPublic,
          isCascading: formData.isCascading,
          lastModified: new Date().toISOString(),
          idWebuserLastModified: 1,
          nameWithoutHtmlTags: formData.name,
          descriptionWithoutHtmlTags: formData.description || null,
          realFilename:
            formData.url.split('/').pop() || editResource.realFilename,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Update resource in Redux state
        dispatch(updateResource(updatedResource));
      } else {
        // Create new resource object
        const newResource: IResource = {
          id: Date.now(),
          name: formData.name,
          description: formData.description || null,
          url: formData.url,
          idLibraryResourceCategory: targetCategoryId, // Use actual category ID
          type: formData.url.toLowerCase().endsWith('.pdf')
            ? ResourceType.PDF
            : ResourceType.Link,
          displayColumns: 3, // Default display columns
          hitCount: 0,
          isCascading: formData.isCascading,
          isPublic: formData.isPublic,
          realFilename: formData.url.split('/').pop() || '',
          nameWithoutHtmlTags: formData.name,
          descriptionWithoutHtmlTags: formData.description || null,
          idWebuserCreated: 1,
          created: new Date().toISOString(),
          idWebuserLastModified: null,
          lastModified: null,
          lastAccessed: null,
          canModify: true,
          canDelete: true,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Add resource to Redux state
        dispatch(addResource(newResource));
      }

      setShowSuccess(true);

      // Reset form after short delay (only for create mode)
      setTimeout(() => {
        if (!isEditMode) {
          setFormData({
            name: '',
            description: '',
            resourceType: 'url',
            url: '',
            file: null,
            location: '',
            parentCategory: 'home',
            excludedLocations: [],
            isPublic: true,
            isCascading: false,
          });
        }
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving resource:', error);
      setErrors({
        name: isEditMode
          ? 'Failed to update resource. Please try again.'
          : 'Failed to create resource. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save and finish (navigates away after saving)
  const handleSaveAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editResource) {
        // Update existing resource
        const updatedResource: IResource = {
          ...editResource,
          name: formData.name,
          description: formData.description || null,
          url: formData.url,
          isPublic: formData.isPublic,
          isCascading: formData.isCascading,
          lastModified: new Date().toISOString(),
          idWebuserLastModified: 1,
          nameWithoutHtmlTags: formData.name,
          descriptionWithoutHtmlTags: formData.description || null,
          realFilename:
            formData.url.split('/').pop() || editResource.realFilename,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Update resource in Redux state
        dispatch(updateResource(updatedResource));
      } else {
        // Create new resource object
        const newResource: IResource = {
          id: Date.now(),
          name: formData.name,
          description: formData.description || null,
          url: formData.url,
          idLibraryResourceCategory: targetCategoryId, // Use actual category ID
          type: formData.url.toLowerCase().endsWith('.pdf')
            ? ResourceType.PDF
            : ResourceType.Link,
          displayColumns: 3, // Default display columns
          hitCount: 0,
          isCascading: formData.isCascading,
          isPublic: formData.isPublic,
          realFilename: formData.url.split('/').pop() || '',
          nameWithoutHtmlTags: formData.name,
          descriptionWithoutHtmlTags: formData.description || null,
          idWebuserCreated: 1,
          created: new Date().toISOString(),
          idWebuserLastModified: null,
          lastModified: null,
          lastAccessed: null,
          canModify: true,
          canDelete: true,
        };

        // Simulate API call
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Add resource to Redux state
        dispatch(addResource(newResource));
      }

      // Navigate to manage mode home with success message
      dispatch(navigateToHome());
      dispatch(resetFilters());
      navigate('/virtual-library', {
        state: {
          successMessage: isEditMode
            ? `Resource "${formData.name}" updated successfully!`
            : `Resource "${formData.name}" created successfully!`,
          enableManageMode: true,
          showResources: true,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error saving resource:', error);
      setErrors({
        name: isEditMode
          ? 'Failed to update resource. Please try again.'
          : 'Failed to create resource. Please try again.',
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
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              {isEditMode ? 'Edit Resource' : 'Create New Resource'}
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
            {/* Resource Name */}
            <Grid item xs={12}>
              <TextField
                id="resource-name-input"
                label="Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleNameChange}
                error={!!errors.name}
                helperText={
                  errors.name || 'Enter the resource name (100 character limit)'
                }
                placeholder="Enter resource name"
                disabled={isSubmitting}
                inputProps={{
                  maxLength: 100,
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

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                id="resource-description-input"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleDescriptionChange}
                error={!!errors.description}
                helperText={
                  errors.description || 'Optional description for the resource'
                }
                placeholder="Enter resource description"
                disabled={isSubmitting}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Grid>

            {/* Resource Type Selection */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                  Resource type:
                </FormLabel>
                <RadioGroup
                  row
                  value={formData.resourceType}
                  onChange={handleResourceTypeChange}
                >
                  <FormControlLabel
                    value="url"
                    control={
                      <Radio
                        sx={{
                          color: COLORS.purple[700],
                          '&.Mui-checked': { color: COLORS.purple[700] },
                        }}
                      />
                    }
                    label="URL"
                    disabled={isSubmitting}
                  />
                  <FormControlLabel
                    value="file"
                    control={
                      <Radio
                        sx={{
                          color: COLORS.purple[700],
                          '&.Mui-checked': { color: COLORS.purple[700] },
                        }}
                      />
                    }
                    label="File"
                    disabled={isSubmitting}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* URL Field - Shown when resourceType is 'url' */}
            {formData.resourceType === 'url' && (
              <Grid item xs={12}>
                <TextField
                  id="resource-url-input"
                  label="URL"
                  fullWidth
                  required
                  value={formData.url}
                  onChange={handleUrlChange}
                  error={!!errors.url}
                  helperText={
                    errors.url ||
                    'Enter the full URL (including http:// or https://)'
                  }
                  placeholder="https://example.com/document.pdf"
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Grid>
            )}

            {/* File Upload - Shown when resourceType is 'file' */}
            {formData.resourceType === 'file' && (
              <Grid item xs={12}>
                <Box>
                  <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                    File: *
                  </FormLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      id="choose-file-btn"
                      variant="outlined"
                      component="label"
                      disabled={isSubmitting}
                      sx={{
                        textTransform: 'none',
                        borderColor: errors.url ? 'error.main' : 'primary.main',
                        color: errors.url ? 'error.main' : 'primary.main',
                        '&:hover': {
                          borderColor: errors.url
                            ? 'error.dark'
                            : 'primary.dark',
                        },
                      }}
                    >
                      Choose File
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        id="file-upload-input"
                      />
                    </Button>
                    <Typography
                      variant="body2"
                      color={formData.file ? 'text.primary' : 'text.secondary'}
                    >
                      {formData.file ? formData.file.name : 'No file chosen'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      100MB maximum
                    </Typography>
                  </Box>
                  {errors.url && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {errors.url}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}

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
                helperText="Select locations where this resource should not appear"
                disabled={isSubmitting}
              />
            </Grid>

            {/* Checkboxes */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="is-public-checkbox"
                      checked={formData.isPublic}
                      onChange={handleIsPublicChange}
                      disabled={isSubmitting}
                      sx={{
                        color: COLORS.purple[700],
                        '&.Mui-checked': { color: COLORS.purple[700] },
                      }}
                    />
                  }
                  label="Public (visible to all users)"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id="is-cascading-checkbox"
                      checked={formData.isCascading}
                      onChange={handleIsCascadingChange}
                      disabled={isSubmitting}
                      sx={{
                        color: COLORS.purple[700],
                        '&.Mui-checked': { color: COLORS.purple[700] },
                      }}
                    />
                  }
                  label="Cascading (available to all subcategories)"
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            <Button
              id="save-resource-btn"
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

      {/* Success notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => {
          setShowSuccess(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          onClose={() => {
            setShowSuccess(false);
          }}
        >
          {isEditMode
            ? `Resource "${formData.name}" updated successfully!`
            : `Resource "${formData.name}" created successfully!`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Wrap the content component with ManageModeProvider
// eslint-disable-next-line react/no-multi-comp
const CreateResourcePage: React.FC = () => {
  return (
    <ManageModeProvider>
      <CreateResourcePageContent />
    </ManageModeProvider>
  );
};

export default CreateResourcePage;
