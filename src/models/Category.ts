/**
 * Category form models and types
 */

export interface ICategoryFormData {
  name: string;
  location: string;
  parentCategory: string;
  excludedLocations: string[];
}

export interface ILocationNode {
  id: string;
  name: string;
  type: 'root' | 'location' | 'sublocation';
  children?: ILocationNode[];
  parentId?: string;
}
