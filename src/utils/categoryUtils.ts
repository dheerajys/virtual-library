/**
 * Utility functions for working with categories and lineage
 */

import { ICategory, IBreadcrumb } from '../models';

/**
 * Build a hierarchical tree from flat category list
 * @param categories Flat list of categories
 * @param parentId Parent ID to filter by (null for root)
 * @returns Hierarchical category tree
 */
export const buildCategoryTree = (
  categories: ICategory[],
  parentId: number | null = null
): ICategory[] => {
  return categories
    .filter((cat) => cat.idParent === parentId)
    .map((cat) => ({
      ...cat,
      subcategories: buildCategoryTree(categories, cat.id),
      resourceCount: cat.resourceCount || 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Get root categories (depth = 1, children of Home)
 * @param categories All categories
 * @returns Root level categories
 */
export const getRootCategories = (categories: ICategory[]): ICategory[] => {
  const homeCategory = categories.find(
    (cat) => cat.name === 'Home' && cat.depth === 0
  );
  if (!homeCategory) {
    return categories.filter((cat) => cat.idParent === null);
  }
  return categories.filter((cat) => cat.idParent === homeCategory.id);
};

/**
 * Get subcategories for a given category
 * @param categories All categories
 * @param parentId Parent category ID
 * @returns Child categories
 */
export const getSubcategories = (
  categories: ICategory[],
  parentId: number
): ICategory[] => {
  return categories
    .filter((cat) => cat.idParent === parentId)
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Parse lineage string into breadcrumb parts
 * @param lineage Lineage string (e.g., "/Home/Board Documents/Manual/")
 * @returns Array of lineage parts
 */
export const parseLineage = (lineage: string): string[] => {
  return lineage.split('/').filter((part) => part.trim() !== '');
};

/**
 * Build breadcrumbs from category lineage
 * @param category Current category
 * @param allCategories All categories for lookup
 * @returns Breadcrumb trail
 */
export const buildBreadcrumbs = (
  category: ICategory | null,
  allCategories: ICategory[]
): IBreadcrumb[] => {
  const breadcrumbs: IBreadcrumb[] = [];

  if (!category) {
    return breadcrumbs;
  }

  // Parse lineage to get path segments
  const lineageParts = parseLineage(category.lineage);

  // Build breadcrumbs for each level in the lineage
  let currentLineage = '/';
  lineageParts.forEach((part, index) => {
    currentLineage = `${currentLineage}${part}/`;
    const cat = allCategories.find((c) => c.lineagePlusName === currentLineage);

    if (cat) {
      breadcrumbs.push({
        id: cat.id,
        label: cat.name,
        lineage: currentLineage,
      });
    } else {
      // Fallback if category not found in list
      breadcrumbs.push({
        id: index,
        label: part,
        lineage: currentLineage,
      });
    }
  });

  // Add current category
  breadcrumbs.push({
    id: category.id,
    label: category.name,
    lineage: category.lineagePlusName,
  });

  return breadcrumbs;
};

/**
 * Find category by ID
 * @param categories All categories
 * @param id Category ID
 * @returns Category or undefined
 */
export const findCategoryById = (
  categories: ICategory[],
  id: number
): ICategory | undefined => {
  return categories.find((cat) => cat.id === id);
};

/**
 * Find category by lineage
 * @param categories All categories
 * @param lineage Full lineage path
 * @returns Category or undefined
 */
export const findCategoryByLineage = (
  categories: ICategory[],
  lineage: string
): ICategory | undefined => {
  return categories.find((cat) => cat.lineagePlusName === lineage);
};

/**
 * Get parent category
 * @param categories All categories
 * @param categoryId Child category ID
 * @returns Parent category or undefined
 */
export const getParentCategory = (
  categories: ICategory[],
  categoryId: number
): ICategory | undefined => {
  const category = findCategoryById(categories, categoryId);
  if (!category || !category.idParent) {
    return undefined;
  }
  return findCategoryById(categories, category.idParent);
};

/**
 * Check if a category has subcategories
 * @param categories All categories
 * @param categoryId Category ID to check
 * @returns True if has subcategories
 */
export const hasSubcategories = (
  categories: ICategory[],
  categoryId: number
): boolean => {
  return categories.some((cat) => cat.idParent === categoryId);
};

/**
 * Get all descendant category IDs (including the category itself)
 * Used for fetching resources from a category and all its subcategories
 * @param categories All categories
 * @param categoryId Root category ID
 * @returns Array of category IDs
 */
export const getDescendantCategoryIds = (
  categories: ICategory[],
  categoryId: number
): number[] => {
  const descendants: number[] = [categoryId];
  const subcategories = getSubcategories(categories, categoryId);

  subcategories.forEach((subcat) => {
    descendants.push(...getDescendantCategoryIds(categories, subcat.id));
  });

  return descendants;
};

/**
 * Count resources for a category (to be used with resource data)
 * @param categoryId Category ID
 * @param resources All resources
 * @param categories All categories (needed if includeDescendants is true)
 * @param includeDescendants Include resources from subcategories
 * @returns Resource count
 */
export const countCategoryResources = (
  categoryId: number,
  resources: { idLibraryResourceCategory: number }[],
  categories?: ICategory[],
  includeDescendants: boolean = false
): number => {
  if (!includeDescendants) {
    return resources.filter((r) => r.idLibraryResourceCategory === categoryId)
      .length;
  }

  if (!categories) {
    return resources.filter((r) => r.idLibraryResourceCategory === categoryId)
      .length;
  }

  const categoryIds = getDescendantCategoryIds(categories, categoryId);
  return resources.filter((r) =>
    categoryIds.includes(r.idLibraryResourceCategory)
  ).length;
};
