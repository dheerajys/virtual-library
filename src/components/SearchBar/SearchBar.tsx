/**
 * SearchBar component with advanced filtering capabilities
 * Integrates with intelligent search that first searches locally,
 * then falls back to API for suggestions if no matches found
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Switch,
  Menu,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import MicIcon from '@mui/icons-material/Mic';
import { COLORS } from 'pvs-design-system';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setSearchTerm,
  resetFilters,
  setSearchMode,
} from '../../store/virtualLibrarySlice';
import { useIntelligentSearch } from '../../hooks';

// Type definition for Speech Recognition API
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: { transcript: string }[][] }) => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

interface IWindowWithSpeechRecognition extends Window {
  SpeechRecognition?: ISpeechRecognitionConstructor;
  webkitSpeechRecognition?: ISpeechRecognitionConstructor;
}

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const { searchFilters } = useSelector(
    (state: RootState) => state.virtualLibrary
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Use intelligent search hook to get search status
  const intelligentSearchResults = useIntelligentSearch(
    searchFilters.searchTerm
  );

  // Initialize local state based on Redux searchMode
  const [searchInCategories, setSearchInCategories] = useState(
    searchFilters.searchMode === 'categories' ||
      searchFilters.searchMode === 'all'
  );
  const [searchInResources, setSearchInResources] = useState(
    searchFilters.searchMode === 'resources' ||
      searchFilters.searchMode === 'all'
  );

  // Sync local state with Redux searchMode when it changes
  useEffect(() => {
    setSearchInCategories(
      searchFilters.searchMode === 'categories' ||
        searchFilters.searchMode === 'all'
    );
    setSearchInResources(
      searchFilters.searchMode === 'resources' ||
        searchFilters.searchMode === 'all'
    );
    // setSearchInCategories and setSearchInResources are stable functions from useState
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters.searchMode]);

  // Check if speech recognition is supported
  useEffect(() => {
    const win = window as unknown as IWindowWithSpeechRecognition;
    const SpeechRecognition =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Voice search handler
  const handleVoiceSearch = useCallback(() => {
    const win = window as unknown as IWindowWithSpeechRecognition;
    const SpeechRecognition =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // eslint-disable-next-line no-alert
      alert(
        'Voice search is not supported in your browser. Please try Chrome, Edge, or Safari.'
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const { transcript } = event.results[0][0];
      dispatch(setSearchTerm(transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      setIsListening(false);
    }
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleClearSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setSearchTerm(''));
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleCategoryCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setSearchInCategories(checked);

    // Update search mode based on checkbox states
    if (checked && searchInResources) {
      dispatch(setSearchMode('all'));
    } else if (checked && !searchInResources) {
      dispatch(setSearchMode('categories'));
    } else if (!checked && searchInResources) {
      dispatch(setSearchMode('resources'));
    } else {
      // If both unchecked, default to 'all'
      dispatch(setSearchMode('all'));
      setSearchInCategories(true);
      setSearchInResources(true);
    }
  };

  const handleResourceCheckChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    setSearchInResources(checked);

    // Update search mode based on checkbox states
    if (searchInCategories && checked) {
      dispatch(setSearchMode('all'));
    } else if (!searchInCategories && checked) {
      dispatch(setSearchMode('resources'));
    } else if (searchInCategories && !checked) {
      dispatch(setSearchMode('categories'));
    } else {
      // If both unchecked, default to 'all'
      dispatch(setSearchMode('all'));
      setSearchInCategories(true);
      setSearchInResources(true);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
      }}
    >
      {/* Search input row */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextField
          id="virtual-library-search"
          fullWidth
          placeholder="Search for resources, documents, guides..."
          value={searchFilters.searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: COLORS.purple[700], fontSize: 22 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Show loading indicator when searching */}
                  {intelligentSearchResults.isSearching &&
                    searchFilters.searchTerm && (
                      <CircularProgress
                        size={20}
                        sx={{ color: COLORS.purple[700] }}
                      />
                    )}
                  {/* Voice search button */}
                  {speechSupported && (
                    <Tooltip
                      title={
                        isListening
                          ? 'Listening...'
                          : 'Click to search with your voice'
                      }
                    >
                      <IconButton
                        id="voice-search-btn"
                        size="small"
                        onClick={handleVoiceSearch}
                        disabled={isListening}
                        aria-label="voice search"
                        sx={{
                          color: isListening
                            ? COLORS.purple[700]
                            : 'text.secondary',
                          animation: isListening
                            ? 'pulse 1.5s ease-in-out infinite'
                            : 'none',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.1)',
                              opacity: 0.8,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                          '&:hover': {
                            color: COLORS.purple[700],
                            bgcolor: 'rgba(114, 35, 98, 0.08)',
                          },
                          '&.Mui-disabled': {
                            color: COLORS.purple[700],
                          },
                        }}
                      >
                        <MicIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {/* Clear button */}
                  {searchFilters.searchTerm && (
                    <IconButton
                      id="clear-search-btn"
                      size="small"
                      onClick={handleClearSearch}
                      aria-label="clear search"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: COLORS.purple[700],
                          bgcolor: 'rgba(114, 35, 98, 0.08)',
                        },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#ffffff',
              borderRadius: 2,
              fontSize: '14px',
              '& fieldset': {
                borderColor: '#e1e4e8',
                borderWidth: 1.5,
              },
              '&:hover fieldset': {
                borderColor: COLORS.purple[700],
              },
              '&.Mui-focused fieldset': {
                borderColor: COLORS.purple[700],
                borderWidth: 1.5,
              },
            },
            '& .MuiInputBase-input': {
              py: 1.25,
              fontSize: '14px',
            },
          }}
        />

        <Button
          id="filter-menu-btn"
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{
            bgcolor: COLORS.purple[700],
            textTransform: 'none',
            px: 2.5,
            py: 1.25,
            fontWeight: 600,
            fontSize: '14px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(114, 35, 98, 0.2)',
            '&:hover': {
              bgcolor: COLORS.purple[800],
              boxShadow: '0 4px 12px rgba(114, 35, 98, 0.3)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Search status chips */}
      {searchFilters.searchTerm && intelligentSearchResults.searchMethod && (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', px: 0.5 }}>
          {!intelligentSearchResults.hasResults &&
            !intelligentSearchResults.isSearching && (
              <Chip
                label="No matches found"
                size="small"
                color="warning"
                sx={{ fontSize: '13px' }}
              />
            )}
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            minWidth: 340,
            p: 2.5,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1px solid #e1e4e8',
          },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2.5,
              fontWeight: 700,
              color: COLORS.purple[700],
              fontSize: '16px',
            }}
          >
            Filter Options
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: 'text.secondary',
              fontSize: '16px',
            }}
          >
            Search In:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                bgcolor: searchInCategories
                  ? 'rgba(114, 35, 98, 0.08)'
                  : '#fafbfc',
                border: 2,
                borderColor: searchInCategories
                  ? COLORS.purple[700]
                  : '#e1e4e8',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: searchInCategories
                    ? 'rgba(114, 35, 98, 0.12)'
                    : '#f6f8fa',
                  borderColor: COLORS.purple[700],
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CategoryIcon
                  sx={{
                    fontSize: 24,
                    color: searchInCategories
                      ? COLORS.purple[700]
                      : 'action.disabled',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: searchInCategories ? 600 : 500,
                      color: searchInCategories
                        ? 'text.primary'
                        : 'text.secondary',
                      fontSize: '16px',
                    }}
                  >
                    Categories
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: searchInCategories
                        ? COLORS.purple[700]
                        : 'text.disabled',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {searchInCategories ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                id="search-categories-switch"
                checked={searchInCategories}
                onChange={handleCategoryCheckChange}
                color="primary"
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                bgcolor: searchInResources
                  ? 'rgba(114, 35, 98, 0.08)'
                  : '#fafbfc',
                border: 2,
                borderColor: searchInResources ? COLORS.purple[700] : '#e1e4e8',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: searchInResources
                    ? 'rgba(114, 35, 98, 0.12)'
                    : '#f6f8fa',
                  borderColor: COLORS.purple[700],
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionIcon
                  sx={{
                    fontSize: 24,
                    color: searchInResources
                      ? COLORS.purple[700]
                      : 'action.disabled',
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: searchInResources ? 600 : 500,
                      color: searchInResources
                        ? 'text.primary'
                        : 'text.secondary',
                      fontSize: '16px',
                    }}
                  >
                    Resources
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: searchInResources
                        ? COLORS.purple[700]
                        : 'text.disabled',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {searchInResources ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                id="search-resources-switch"
                checked={searchInResources}
                onChange={handleResourceCheckChange}
                color="primary"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          id="reset-filters-menu-btn"
          size="medium"
          onClick={handleResetFilters}
          fullWidth
          variant="outlined"
          sx={{
            borderColor: COLORS.purple[700],
            color: COLORS.purple[700],
            fontWeight: 600,
            borderWidth: 2,
            borderRadius: 2,
            py: 1,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 4px rgba(114, 35, 98, 0.15)',
            },
          }}
        >
          Reset All Filters
        </Button>
      </Menu>
    </Box>
  );
};

export default SearchBar;
