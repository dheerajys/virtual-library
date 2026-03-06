/**
 * Mock API data matching the /Library/categories-with-resources endpoint response
 */

import {
  ApiCategoryResponse,
  ApiResourceResponse,
} from '../services/virtualLibraryApi';

/**
 * Mock categories response matching API structure
 */
export const mockApiCategories: ApiCategoryResponse[] = [
  {
    name: 'School Handbooks',
    count: 5,
    categoryCount: 3,
    canModify: true,
    canDelete: false,
  },
  {
    name: 'Accessibility',
    count: 3,
    categoryCount: 2,
    canModify: true,
    canDelete: true,
  },
  {
    name: 'Administrative Services & Support',
    count: 8,
    categoryCount: 4,
    canModify: true,
    canDelete: true,
  },
  {
    name: 'Board Member Documents - ACA',
    count: 12,
    categoryCount: 3,
    canModify: false,
    canDelete: false,
  },
  {
    name: 'Board Member Documents - Alpaugh (CalCAN and CenCA)',
    count: 10,
    categoryCount: 2,
    canModify: false,
    canDelete: false,
  },
  {
    name: 'Board Member Documents - ARCA',
    count: 9,
    categoryCount: 0,
    canModify: false,
    canDelete: false,
  },
  {
    name: 'My School: Connections Academy at Springs',
    count: 7,
    categoryCount: 3,
    canModify: true,
    canDelete: true,
  },
  {
    name: 'My School: Cypress Connections Academy',
    count: 6,
    categoryCount: 3,
    canModify: true,
    canDelete: true,
  },
  {
    name: 'My School: FCA',
    count: 5,
    categoryCount: 0,
    canModify: true,
    canDelete: true,
  },
  {
    name: 'My School: Georgia',
    count: 8,
    categoryCount: 3,
    canModify: true,
    canDelete: true,
  },
];

/**
 * Mock resources response matching API structure
 */
export const mockApiResources: ApiResourceResponse[] = [
  {
    id: 1,
    name: 'A Look at Product Highlights',
    url: '/resources/product-highlights',
    description:
      'This site provides an ongoing view of product updates intended to enhance the learning experience for Connections Academy students and teachers.',
    canModify: true,
    canDelete: true,
    displayColumns: 3,
    realFileName: null,
  },
  {
    id: 2,
    name: 'Accessibility Conformance Reports',
    url: '/resources/accessibility-reports',
    description:
      'Comprehensive accessibility conformance reports and VPAT documentation for our platform.',
    canModify: true,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 3,
    name: 'Capturing Content Tips',
    url: '/resources/content-tips',
    description: 'Best practices and tips for capturing and organizing content',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 4,
    name: 'Connections Honor Code (Grades 6-12)',
    url: '/resources/honor-code-6-12',
    description:
      'Official honor code document for middle and high school students',
    canModify: false,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 5,
    name: 'Connections Honor Code (K-5)',
    url: '/resources/honor-code-k-5',
    description: 'Official honor code document for elementary school students',
    canModify: false,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 6,
    name: 'Facility Request Form',
    url: '/resources/facility-request-form',
    description:
      'This form will be used by PVS schools to request the assistance of the Pearson Facilities Team to help facilitate with issues.',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 7,
    name: 'Grade 4 ELA Chinook Jargon',
    url: '/resources/grade-4-ela-chinook',
    description: 'Please review before using with students.',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 8,
    name: 'How Do I Log It? Activity Updated 6/21/23 for 23-24 SY',
    url: '/resources/log-activity-guide',
    description:
      'Updated activity logging guidelines for the 2023-24 school year',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 9,
    name: 'Media Consent & Release Directions for Students and Caretakers',
    url: '/resources/media-consent-directions',
    description:
      'These are directions for how a Caretaker can change the Media Consent and Release election for themselves and their student(s).',
    canModify: true,
    canDelete: false,
    displayColumns: 1,
    realFileName: null,
  },
  {
    id: 10,
    name: 'Pearson Online Academy Honor Code (PT)',
    url: '/resources/poa-honor-code-pt',
    description: 'Honor code for Pearson Online Academy Part-Time students',
    canModify: false,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 11,
    name: 'Pearson Online Academy Honor Code (FT)',
    url: '/resources/poa-honor-code-ft',
    description: 'Honor code for Pearson Online Academy Full-Time students',
    canModify: false,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 12,
    name: 'PNG Logos',
    url: '/resources/png-logos',
    description: 'Middle School College Exploration PNG Logos',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 13,
    name: 'School Representatives PowerBI Report',
    url: '/resources/school-representatives-report',
    description:
      'This file contains the links to the School Representatives Report as well as the guidance for using the report.',
    canModify: true,
    canDelete: true,
    displayColumns: 0,
    realFileName: null,
  },
  {
    id: 14,
    name: 'Virtual Library Owners',
    url: '/resources/library-owners',
    description:
      'A list of who is responsible for each category of the Virtual Library',
    canModify: true,
    canDelete: false,
    displayColumns: 0,
    realFileName: null,
  },
];

/**
 * Get mock library data for a specific lineage and category
 * Simulates the /Library/categories-with-resources endpoint
 */
export function getMockLibraryData(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  idWebuser: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isManagedMode: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lineage: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  category: string
) {
  // For now, return all categories and resources
  // In a real implementation, this would filter by lineage and category
  return {
    categories: mockApiCategories,
    resources: mockApiResources,
  };
}
