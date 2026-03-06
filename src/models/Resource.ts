/**
 * Resource domain models
 */

/**
 * Resource type - URL or File
 */
export type ResourceType = 'url' | 'file';

/**
 * Form data for creating/editing resources
 */
export interface IResourceFormData {
  name: string;
  description: string;
  resourceType: ResourceType;
  url: string;
  file: File | null;
  location: string;
  parentCategory: string;
  excludedLocations: string[];
  isPublic: boolean;
  isCascading: boolean;
}
