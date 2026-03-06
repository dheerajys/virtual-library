/**
 * Mock Data Service
 * Simulates API behavior by returning categories and resources based on lineage
 */

import { ICategory, IResource } from '../models';
import { mockCategories, mockResources } from '../data/mockVirtualLibraryData';
import {
  GetLibraryDataResponse,
  ApiCategoryResponse,
  ApiResourceResponse,
} from './virtualLibraryApi';

/**
 * Get all descendant category IDs for a given category
 * This includes the category itself and all its subcategories recursively
 */
function getDescendantCategoryIds(categoryId: number): number[] {
  const descendants: number[] = [categoryId];

  // Find all direct children
  const children = mockCategories.filter((cat) => cat.idParent === categoryId);

  // Recursively add descendants of children
  children.forEach((child) => {
    descendants.push(...getDescendantCategoryIds(child.id));
  });

  return descendants;
}

/**
 * Transform ICategory to ApiCategoryResponse
 */
function transformToApiCategory(cat: ICategory): ApiCategoryResponse {
  return {
    name: cat.name,
    count: cat.resourceCount ?? 0,
    categoryCount: cat.subcategories?.length ?? 0,
    canModify: cat.canModify ?? true,
    canDelete: cat.canDelete ?? true,
  };
}

/**
 * Transform IResource to ApiResourceResponse
 */
function transformToApiResource(res: IResource): ApiResourceResponse {
  return {
    id: res.id,
    name: res.name,
    url: res.url,
    description: res.description ?? '',
    canModify: res.canModify ?? true,
    canDelete: res.canDelete ?? true,
    displayColumns: res.displayColumns ?? 1,
    realFileName: res.realFilename,
  };
}

/**
 * Get mock library data based on lineage and category name
 * Simulates the API endpoint GET /Library/categories-with-resources
 *
 * @param idWebuser - User ID (unused in mock)
 * @param isManagedMode - Whether user is in manage mode (unused in mock)
 * @param lineage - The category lineage path (e.g., "/Home/" or "/Home/Curriculum Resources/")
 * @param category - The current category name being viewed (e.g., "Home", "Curriculum Resources", "Mathematics")
 * @returns Mock data response matching the API structure
 *
 * @example
 * // Initial page load
 * getMockLibraryData(5970235, false, '/Home/', 'Home')
 * // Returns root categories (Board Documents, Curriculum Resources, etc.)
 *
 * @example
 * // After clicking "Curriculum Resources"
 * getMockLibraryData(5970235, false, '/Home/Curriculum Resources/', 'Curriculum Resources')
 * // Returns subcategories (Mathematics, Science, Language Arts, Social Studies)
 *
 * @example
 * // After clicking "Mathematics"
 * getMockLibraryData(5970235, false, '/Home/Curriculum Resources/Mathematics/', 'Mathematics')
 * // Returns Mathematics subcategories and resources
 */
export function getMockLibraryData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  idWebuser: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isManagedMode: boolean,
  lineage: string,
  category: string = 'Home'
): GetLibraryDataResponse {
  // Special case for Home
  if (lineage === '/Home/' && category === 'Home') {
    const homeCategory = mockCategories.find(
      (cat) => cat.name === 'Home' && cat.depth === 0
    );
    if (!homeCategory) {
      // eslint-disable-next-line no-console
      console.warn('Home category not found');
      return { categories: [], resources: [] };
    }

    const subcategories = mockCategories.filter(
      (cat) => cat.idParent === homeCategory.id
    );
    const resources = mockResources.filter(
      (res) => res.idLibraryResourceCategory === homeCategory.id
    );

    return {
      categories: subcategories.map(transformToApiCategory),
      resources: resources.map(transformToApiResource),
    };
  }

  // For other categories, the lineage represents the path TO this category
  // So we need to find the category whose lineagePlusName matches the lineage
  // OR whose parent lineage + name equals the incoming lineage
  const currentCategory = mockCategories.find(
    (cat) => cat.lineagePlusName === lineage && cat.name === category
  );

  if (!currentCategory) {
    // eslint-disable-next-line no-console
    console.warn(
      `Category not found: lineage="${lineage}", category="${category}"`,
      '\nSearching for category with lineagePlusName matching lineage'
    );
    return { categories: [], resources: [] };
  }

  // Find all categories that are direct children of the current category
  // These are categories where idParent === currentCategory.id
  const subcategories = mockCategories.filter(
    (cat) => cat.idParent === currentCategory.id
  );

  // Get resources that belong directly to the current category only
  // NOT descendants - those will be fetched when we navigate to them
  const resources = mockResources.filter(
    (res) => res.idLibraryResourceCategory === currentCategory.id
  );

  return {
    categories: subcategories.map(transformToApiCategory),
    resources: resources.map(transformToApiResource),
  };
}

/**
 * Get a specific category by ID
 */
export function getMockCategoryById(id: number): ICategory | undefined {
  return mockCategories.find((cat) => cat.id === id);
}

/**
 * Get a specific resource by ID
 */
export function getMockResourceById(id: number): IResource | undefined {
  return mockResources.find((res) => res.id === id);
}

/**
 * Calculate resource count for a category (including descendants)
 */
export function getMockCategoryResourceCount(categoryId: number): number {
  const descendantIds = getDescendantCategoryIds(categoryId);
  return mockResources.filter((res) =>
    descendantIds.includes(res.idLibraryResourceCategory)
  ).length;
}
