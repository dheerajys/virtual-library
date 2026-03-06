/**
 * Virtual Library domain models
 */

/**
 * Represents a category in the Virtual Library (from LibraryResourceCategory table)
 * Categories organize resources into logical groups with hierarchical structure
 */
export interface ICategory {
  id: number;
  idParent: number | null;
  idLocation: number;
  name: string;
  lineage: string; // e.g., "/Home/Board Member Documents-ACA/Board Manual/"
  depth: number;
  displayColumns: string | null;
  lineagePlusName: string; // e.g., "/Home/Board Member Documents-ACA/Board Manual/D&O Insurance Coverage/"
  resourceCount?: number; // Computed field for UI (from API: count)
  categoryCount?: number; // Subcategory count (from API)
  canModify?: boolean; // Permission to modify (from API)
  canDelete?: boolean; // Permission to delete (from API)
  subcategories?: ICategory[]; // Populated for UI navigation
  isFavorite?: boolean; // Quick access favorite flag
}

/**
 * Represents a resource/document in the Virtual Library (from LibraryResource table)
 */
export interface IResource {
  id: number;
  idLibraryResourceCategory: number; // FK to category
  name: string;
  description: string | null;
  url: string;
  hitCount: number;
  isCascading: boolean;
  isPublic: boolean;
  realFilename: string;
  nameWithoutHtmlTags: string;
  descriptionWithoutHtmlTags: string | null;
  idWebuserCreated: number;
  created: string;
  idWebuserLastModified: number | null;
  lastModified: string | null;
  lastAccessed: string | null;
  displayColumns?: number; // Column display preference (from API)
  canModify?: boolean; // Permission to modify (from API)
  canDelete?: boolean; // Permission to delete (from API)
  type?: ResourceType; // Computed from filename extension
  categoryName?: string; // Populated from join for UI
  isFavorite?: boolean; // Quick access favorite flag
}

/**
 * Types of resources available in the Virtual Library
 * Determined by URL pattern
 */
export enum ResourceType {
  PDF = 'pdf',
  Link = 'link',
}

/**
 * Search mode for filtering
 */
export type SearchMode = 'categories' | 'resources' | 'all';

/**
 * Search filter parameters
 */
export interface ISearchFilters {
  searchTerm: string;
  selectedCategories: string[];
  resourceTypes: ResourceType[];
  dateRange?: {
    start: string | null;
    end: string | null;
  };
  showFeaturedOnly: boolean;
  searchMode: SearchMode;
}

/**
 * Breadcrumb navigation item
 */
export interface IBreadcrumb {
  id: string | number; // Can be category name (string) or ID (number)
  label: string;
  lineage?: string; // Optional full lineage path for navigation
}
