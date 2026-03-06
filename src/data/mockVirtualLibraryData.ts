/**
 * Mock data for Virtual Library matching actual database structure
 * Based on LibraryResourceCategory and LibraryResource tables
 *
 * Structure supports 3 levels of navigation:
 * Level 0: Home (root category)
 * Level 1: Root categories (Board Documents, Curriculum Resources, Professional Development)
 * Level 2: Subcategories (Board Meetings, Mathematics, Teacher Training, etc.)
 * Level 3: Leaf categories (2024 Meetings, Algebra, New Teacher Orientation, etc.)
 */

import { ICategory, IResource, ResourceType } from '../models';

/**
 * Mock categories organized in a 3-level hierarchy
 */
export const mockCategories: ICategory[] = [
  // ============================================
  // LEVEL 0: Home (Root)
  // ============================================
  {
    id: 1,
    name: 'Home',
    lineage: '/Home/',
    depth: 0,
    idParent: null,
    idLocation: 1,
    displayColumns: null,
    lineagePlusName: '/Home/',
  },

  // ============================================
  // LEVEL 1: Root Categories (Children of Home)
  // ============================================
  {
    id: 100,
    name: 'Board Documents',
    lineage: '/Home/',
    depth: 1,
    idParent: 1,
    idLocation: 101, // school-board-member -> board-governance
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/',
  },
  {
    id: 200,
    name: 'Curriculum Resources',
    lineage: '/Home/',
    depth: 1,
    idParent: 1,
    idLocation: 201, // connections-education -> connections-academy -> connections-academy-california
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/',
  },
  {
    id: 300,
    name: 'Professional Development',
    lineage: '/Home/',
    depth: 1,
    idParent: 1,
    idLocation: 301, // connections-education -> ce-university -> ce-university-training
    displayColumns: null,
    lineagePlusName: '/Home/Professional Development/',
  },

  // ============================================
  // LEVEL 2: Board Documents > Subcategories
  // ============================================
  {
    id: 101,
    name: 'Board Meetings',
    lineage: '/Home/Board Documents/',
    depth: 2,
    idParent: 100,
    idLocation: 102, // school-board-member -> board-policies
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Board Meetings/',
  },
  {
    id: 102,
    name: 'Policies',
    lineage: '/Home/Board Documents/',
    depth: 2,
    idParent: 100,
    idLocation: 103, // school-board-member -> board-meetings
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Policies/',
  },

  // ============================================
  // LEVEL 2: Curriculum Resources > Subcategories
  // ============================================
  {
    id: 201,
    name: 'Mathematics',
    lineage: '/Home/Curriculum Resources/',
    depth: 2,
    idParent: 200,
    idLocation: 202, // connections-education -> connections-academy -> connections-academy-florida
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Mathematics/',
  },
  {
    id: 202,
    name: 'Science',
    lineage: '/Home/Curriculum Resources/',
    depth: 2,
    idParent: 200,
    idLocation: 203, // connections-education -> connections-academy -> connections-academy-texas
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Science/',
  },
  {
    id: 203,
    name: 'Language Arts',
    lineage: '/Home/Curriculum Resources/',
    depth: 2,
    idParent: 200,
    idLocation: 204, // connections-education -> connections-academy -> connections-academy-ohio
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Language Arts/',
  },

  // ============================================
  // LEVEL 2: Professional Development > Subcategories
  // ============================================
  {
    id: 301,
    name: 'Teacher Training',
    lineage: '/Home/Professional Development/',
    depth: 2,
    idParent: 300,
    idLocation: 302, // connections-education -> ce-university -> ce-university-certifications
    displayColumns: null,
    lineagePlusName: '/Home/Professional Development/Teacher Training/',
  },
  {
    id: 302,
    name: 'Technology Integration',
    lineage: '/Home/Professional Development/',
    depth: 2,
    idParent: 300,
    idLocation: 303, // connections-education -> ce-offices -> ce-offices-it
    displayColumns: null,
    lineagePlusName: '/Home/Professional Development/Technology Integration/',
  },

  // ============================================
  // LEVEL 3: Board Meetings > Leaf Categories
  // ============================================
  {
    id: 111,
    name: '2024 Meetings',
    lineage: '/Home/Board Documents/Board Meetings/',
    depth: 3,
    idParent: 101,
    idLocation: 205, // connections-education -> connections-academy -> connections-academy-arizona
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Board Meetings/2024 Meetings/',
  },
  {
    id: 112,
    name: '2025 Meetings',
    lineage: '/Home/Board Documents/Board Meetings/',
    depth: 3,
    idParent: 101,
    idLocation: 206, // connections-education -> connections-academy -> connections-academy-georgia
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Board Meetings/2025 Meetings/',
  },

  // ============================================
  // LEVEL 3: Policies > Leaf Categories
  // ============================================
  {
    id: 121,
    name: 'Academic Policies',
    lineage: '/Home/Board Documents/Policies/',
    depth: 3,
    idParent: 102,
    idLocation: 207, // connections-education -> connections-academy -> connections-academy-michigan
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Policies/Academic Policies/',
  },
  {
    id: 122,
    name: 'Administrative Policies',
    lineage: '/Home/Board Documents/Policies/',
    depth: 3,
    idParent: 102,
    idLocation: 208, // connections-education -> connections-academy -> connections-academy-virginia
    displayColumns: null,
    lineagePlusName: '/Home/Board Documents/Policies/Administrative Policies/',
  },

  // ============================================
  // LEVEL 3: Mathematics > Leaf Categories
  // ============================================
  {
    id: 211,
    name: 'Algebra',
    lineage: '/Home/Curriculum Resources/Mathematics/',
    depth: 3,
    idParent: 201,
    idLocation: 209, // connections-education -> connections-learning -> connections-learning-core
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Mathematics/Algebra/',
  },
  {
    id: 212,
    name: 'Geometry',
    lineage: '/Home/Curriculum Resources/Mathematics/',
    depth: 3,
    idParent: 201,
    idLocation: 210, // connections-education -> connections-learning -> connections-learning-electives
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Mathematics/Geometry/',
  },
  {
    id: 213,
    name: 'Calculus',
    lineage: '/Home/Curriculum Resources/Mathematics/',
    depth: 3,
    idParent: 201,
    idLocation: 211, // connections-education -> connections-blended -> connections-blended-hybrid
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Mathematics/Calculus/',
  },

  // ============================================
  // LEVEL 3: Science > Leaf Categories
  // ============================================
  {
    id: 221,
    name: 'Biology',
    lineage: '/Home/Curriculum Resources/Science/',
    depth: 3,
    idParent: 202,
    idLocation: 212, // connections-education -> connections-blended -> connections-blended-online
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Science/Biology/',
  },
  {
    id: 222,
    name: 'Chemistry',
    lineage: '/Home/Curriculum Resources/Science/',
    depth: 3,
    idParent: 202,
    idLocation: 213, // test-academy -> test-academy-programs
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Science/Chemistry/',
  },
  {
    id: 223,
    name: 'Physics',
    lineage: '/Home/Curriculum Resources/Science/',
    depth: 3,
    idParent: 202,
    idLocation: 214, // test-academy -> test-academy-courses
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Science/Physics/',
  },

  // ============================================
  // LEVEL 3: Language Arts > Leaf Categories
  // ============================================
  {
    id: 231,
    name: 'Reading Comprehension',
    lineage: '/Home/Curriculum Resources/Language Arts/',
    depth: 3,
    idParent: 203,
    idLocation: 215, // test-academy -> test-academy-faculty
    displayColumns: null,
    lineagePlusName:
      '/Home/Curriculum Resources/Language Arts/Reading Comprehension/',
  },
  {
    id: 232,
    name: 'Writing Skills',
    lineage: '/Home/Curriculum Resources/Language Arts/',
    depth: 3,
    idParent: 203,
    idLocation: 216, // human-resources -> hr-recruitment
    displayColumns: null,
    lineagePlusName: '/Home/Curriculum Resources/Language Arts/Writing Skills/',
  },

  // ============================================
  // LEVEL 3: Teacher Training > Leaf Categories
  // ============================================
  {
    id: 311,
    name: 'New Teacher Orientation',
    lineage: '/Home/Professional Development/Teacher Training/',
    depth: 3,
    idParent: 301,
    idLocation: 217, // human-resources -> hr-training
    displayColumns: null,
    lineagePlusName:
      '/Home/Professional Development/Teacher Training/New Teacher Orientation/',
  },
  {
    id: 312,
    name: 'Continuing Education',
    lineage: '/Home/Professional Development/Teacher Training/',
    depth: 3,
    idParent: 301,
    idLocation: 218, // human-resources -> hr-benefits
    displayColumns: null,
    lineagePlusName:
      '/Home/Professional Development/Teacher Training/Continuing Education/',
  },

  // ============================================
  // LEVEL 3: Technology Integration > Leaf Categories
  // ============================================
  {
    id: 321,
    name: 'Learning Management Systems',
    lineage: '/Home/Professional Development/Technology Integration/',
    depth: 3,
    idParent: 302,
    idLocation: 219, // connections-education -> ce-offices -> ce-offices-admin
    displayColumns: null,
    lineagePlusName:
      '/Home/Professional Development/Technology Integration/Learning Management Systems/',
  },
  {
    id: 322,
    name: 'Digital Tools',
    lineage: '/Home/Professional Development/Technology Integration/',
    depth: 3,
    idParent: 302,
    idLocation: 220, // connections-education -> connections-academy -> connections-academy-washington
    displayColumns: null,
    lineagePlusName:
      '/Home/Professional Development/Technology Integration/Digital Tools/',
  },
];

/**
 * Mock resources distributed across all 3 levels for testing navigation
 */
export const mockResources: IResource[] = [
  // ============================================
  // LEVEL 1: Home - Resources
  // ============================================
  {
    id: 1001,
    idLibraryResourceCategory: 1,
    name: 'Welcome to Virtual Library',
    description: 'Getting started guide for the virtual library system',
    url: 'welcome-guide.pdf',
    hitCount: 10,
    isCascading: false,
    isPublic: true,
    realFilename: 'welcome-guide.pdf',
    nameWithoutHtmlTags: 'Welcome to Virtual Library',
    descriptionWithoutHtmlTags:
      'Getting started guide for the virtual library system',
    idWebuserCreated: 1,
    created: '2024-01-01 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 10:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Home',
  },
  {
    id: 1002,
    idLibraryResourceCategory: 1,
    name: 'Library Navigation Guide',
    description: 'How to navigate and find resources',
    url: 'navigation-guide.pdf',
    hitCount: 5,
    isCascading: false,
    isPublic: true,
    realFilename: 'navigation-guide.pdf',
    nameWithoutHtmlTags: 'Library Navigation Guide',
    descriptionWithoutHtmlTags: 'How to navigate and find resources',
    idWebuserCreated: 1,
    created: '2024-01-01 11:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 11:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Home',
  },

  // ============================================
  // LEVEL 1: Board Documents - Resources
  // ============================================
  {
    id: 1003,
    idLibraryResourceCategory: 100,
    name: 'Board Documents Overview',
    description: 'Overview of all board documents and governance materials',
    url: 'board-documents-overview.pdf',
    hitCount: 20,
    isCascading: false,
    isPublic: true,
    realFilename: 'board-documents-overview.pdf',
    nameWithoutHtmlTags: 'Board Documents Overview',
    descriptionWithoutHtmlTags:
      'Overview of all board documents and governance materials',
    idWebuserCreated: 1,
    created: '2024-01-02 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 09:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Board Documents',
  },
  {
    id: 1004,
    idLibraryResourceCategory: 100,
    name: 'Board Member Directory',
    description: 'Contact information for all board members',
    url: 'board-member-directory.pdf',
    hitCount: 15,
    isCascading: false,
    isPublic: true,
    realFilename: 'board-member-directory.pdf',
    nameWithoutHtmlTags: 'Board Member Directory',
    descriptionWithoutHtmlTags: 'Contact information for all board members',
    idWebuserCreated: 1,
    created: '2024-01-02 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 10:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Board Documents',
  },

  // ============================================
  // LEVEL 2: Board Documents -> Board Meetings - Resources
  // ============================================
  {
    id: 2001,
    idLibraryResourceCategory: 101,
    name: 'Board Meeting Schedule 2024',
    description: 'Annual schedule of board meetings',
    url: 'board-meeting-schedule-2024.pdf',
    hitCount: 15,
    isCascading: false,
    isPublic: true,
    realFilename: 'board-meeting-schedule-2024.pdf',
    nameWithoutHtmlTags: 'Board Meeting Schedule 2024',
    descriptionWithoutHtmlTags: 'Annual schedule of board meetings',
    idWebuserCreated: 1,
    created: '2024-01-05 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 12:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Board Meetings',
  },
  {
    id: 2002,
    idLibraryResourceCategory: 101,
    name: 'Meeting Procedures Guide',
    description: 'Guidelines for conducting board meetings',
    url: 'meeting-procedures.docx',
    hitCount: 8,
    isCascading: false,
    isPublic: true,
    realFilename: 'meeting-procedures.docx',
    nameWithoutHtmlTags: 'Meeting Procedures Guide',
    descriptionWithoutHtmlTags: 'Guidelines for conducting board meetings',
    idWebuserCreated: 1,
    created: '2024-01-05 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 13:00:00.000',
    type: ResourceType.Link,
    categoryName: 'Board Meetings',
  },

  // ============================================
  // LEVEL 3: Board Meetings -> 2024 Meetings - Resources
  // ============================================
  {
    id: 3001,
    idLibraryResourceCategory: 111,
    name: 'January 2024 Meeting Minutes',
    description: 'Minutes from January board meeting',
    url: 'january-2024-minutes.pdf',
    hitCount: 12,
    isCascading: false,
    isPublic: true,
    realFilename: 'january-2024-minutes.pdf',
    nameWithoutHtmlTags: 'January 2024 Meeting Minutes',
    descriptionWithoutHtmlTags: 'Minutes from January board meeting',
    idWebuserCreated: 1,
    created: '2024-01-15 14:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 14:00:00.000',
    type: ResourceType.PDF,
    categoryName: '2024 Meetings',
  },
  {
    id: 3002,
    idLibraryResourceCategory: 111,
    name: 'February 2024 Meeting Minutes',
    description: 'Minutes from February board meeting',
    url: 'february-2024-minutes.pdf',
    hitCount: 10,
    isCascading: false,
    isPublic: true,
    realFilename: 'february-2024-minutes.pdf',
    nameWithoutHtmlTags: 'February 2024 Meeting Minutes',
    descriptionWithoutHtmlTags: 'Minutes from February board meeting',
    idWebuserCreated: 1,
    created: '2024-02-15 14:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 15:00:00.000',
    type: ResourceType.PDF,
    categoryName: '2024 Meetings',
  },
  {
    id: 3003,
    idLibraryResourceCategory: 111,
    name: 'March 2024 Meeting Agenda',
    description: 'Agenda for March board meeting',
    url: 'march-2024-agenda.pdf',
    hitCount: 7,
    isCascading: false,
    isPublic: true,
    realFilename: 'march-2024-agenda.pdf',
    nameWithoutHtmlTags: 'March 2024 Meeting Agenda',
    descriptionWithoutHtmlTags: 'Agenda for March board meeting',
    idWebuserCreated: 1,
    created: '2024-03-10 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 16:00:00.000',
    type: ResourceType.PDF,
    categoryName: '2024 Meetings',
  },

  // ============================================
  // LEVEL 1: Curriculum Resources - Resources
  // ============================================
  {
    id: 1005,
    idLibraryResourceCategory: 200,
    name: 'Curriculum Standards Guide',
    description:
      'Comprehensive guide to curriculum standards across all subjects',
    url: 'curriculum-standards-guide.pdf',
    hitCount: 30,
    isCascading: false,
    isPublic: true,
    realFilename: 'curriculum-standards-guide.pdf',
    nameWithoutHtmlTags: 'Curriculum Standards Guide',
    descriptionWithoutHtmlTags:
      'Comprehensive guide to curriculum standards across all subjects',
    idWebuserCreated: 1,
    created: '2024-01-03 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 09:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Curriculum Resources',
  },
  {
    id: 1006,
    idLibraryResourceCategory: 200,
    name: 'Lesson Planning Templates',
    description: 'Templates for creating effective lesson plans',
    url: 'lesson-planning-templates.docx',
    hitCount: 25,
    isCascading: false,
    isPublic: true,
    realFilename: 'lesson-planning-templates.docx',
    nameWithoutHtmlTags: 'Lesson Planning Templates',
    descriptionWithoutHtmlTags: 'Templates for creating effective lesson plans',
    idWebuserCreated: 1,
    created: '2024-01-03 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 10:00:00.000',
    type: ResourceType.Link,
    categoryName: 'Curriculum Resources',
  },

  // ============================================
  // LEVEL 2: Curriculum Resources -> Mathematics - Resources
  // ============================================
  {
    id: 4001,
    idLibraryResourceCategory: 201,
    name: 'Mathematics Curriculum Overview',
    description: 'Overview of the mathematics curriculum',
    url: 'math-curriculum-overview.pdf',
    hitCount: 20,
    isCascading: false,
    isPublic: true,
    realFilename: 'math-curriculum-overview.pdf',
    nameWithoutHtmlTags: 'Mathematics Curriculum Overview',
    descriptionWithoutHtmlTags: 'Overview of the mathematics curriculum',
    idWebuserCreated: 1,
    created: '2024-02-01 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 17:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Mathematics',
  },
  {
    id: 4002,
    idLibraryResourceCategory: 201,
    name: 'Math Assessment Guide',
    description: 'Guidelines for mathematics assessments',
    url: 'math-assessment-guide.docx',
    hitCount: 15,
    isCascading: false,
    isPublic: true,
    realFilename: 'math-assessment-guide.docx',
    nameWithoutHtmlTags: 'Math Assessment Guide',
    descriptionWithoutHtmlTags: 'Guidelines for mathematics assessments',
    idWebuserCreated: 1,
    created: '2024-02-01 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 18:30:00.000',
    type: ResourceType.Link,
    categoryName: 'Mathematics',
  },

  // ============================================
  // LEVEL 3: Mathematics -> Algebra - Resources
  // ============================================
  {
    id: 5001,
    idLibraryResourceCategory: 211,
    name: 'Algebra I Lesson Plans',
    description: 'Complete lesson plans for Algebra I',
    url: 'algebra-1-lesson-plans.pdf',
    hitCount: 25,
    isCascading: false,
    isPublic: true,
    realFilename: 'algebra-1-lesson-plans.pdf',
    nameWithoutHtmlTags: 'Algebra I Lesson Plans',
    descriptionWithoutHtmlTags: 'Complete lesson plans for Algebra I',
    idWebuserCreated: 1,
    created: '2024-02-10 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 19:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Algebra',
  },
  {
    id: 5002,
    idLibraryResourceCategory: 211,
    name: 'Algebra Practice Problems',
    description: 'Practice problems with solutions',
    url: 'algebra-practice-problems.pdf',
    hitCount: 30,
    isCascading: false,
    isPublic: true,
    realFilename: 'algebra-practice-problems.pdf',
    nameWithoutHtmlTags: 'Algebra Practice Problems',
    descriptionWithoutHtmlTags: 'Practice problems with solutions',
    idWebuserCreated: 1,
    created: '2024-02-10 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 20:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Algebra',
  },
  {
    id: 5003,
    idLibraryResourceCategory: 211,
    name: 'Algebra Assessment Templates',
    description: 'Templates for creating algebra assessments',
    url: 'algebra-assessments.xlsx',
    hitCount: 18,
    isCascading: false,
    isPublic: true,
    realFilename: 'algebra-assessments.xlsx',
    nameWithoutHtmlTags: 'Algebra Assessment Templates',
    descriptionWithoutHtmlTags: 'Templates for creating algebra assessments',
    idWebuserCreated: 1,
    created: '2024-02-10 11:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 21:00:00.000',
    type: ResourceType.Link,
    categoryName: 'Algebra',
  },

  // ============================================
  // LEVEL 1: Professional Development - Resources
  // ============================================
  {
    id: 1007,
    idLibraryResourceCategory: 300,
    name: 'Professional Development Catalog',
    description: 'Complete catalog of professional development opportunities',
    url: 'pd-catalog.pdf',
    hitCount: 28,
    isCascading: false,
    isPublic: true,
    realFilename: 'pd-catalog.pdf',
    nameWithoutHtmlTags: 'Professional Development Catalog',
    descriptionWithoutHtmlTags:
      'Complete catalog of professional development opportunities',
    idWebuserCreated: 1,
    created: '2024-01-04 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 09:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Professional Development',
  },
  {
    id: 1008,
    idLibraryResourceCategory: 300,
    name: 'Professional Growth Plan Template',
    description: 'Template for creating individual professional growth plans',
    url: 'growth-plan-template.docx',
    hitCount: 20,
    isCascading: false,
    isPublic: true,
    realFilename: 'growth-plan-template.docx',
    nameWithoutHtmlTags: 'Professional Growth Plan Template',
    descriptionWithoutHtmlTags:
      'Template for creating individual professional growth plans',
    idWebuserCreated: 1,
    created: '2024-01-04 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 10:00:00.000',
    type: ResourceType.Link,
    categoryName: 'Professional Development',
  },

  // ============================================
  // LEVEL 2: Professional Development -> Teacher Training - Resources
  // ============================================
  {
    id: 6001,
    idLibraryResourceCategory: 301,
    name: 'Teacher Training Program Overview',
    description: 'Overview of professional development programs',
    url: 'teacher-training-overview.pdf',
    hitCount: 22,
    isCascading: false,
    isPublic: true,
    realFilename: 'teacher-training-overview.pdf',
    nameWithoutHtmlTags: 'Teacher Training Program Overview',
    descriptionWithoutHtmlTags: 'Overview of professional development programs',
    idWebuserCreated: 1,
    created: '2024-03-01 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 22:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Teacher Training',
  },
  {
    id: 6002,
    idLibraryResourceCategory: 301,
    name: 'Training Calendar 2024',
    description: 'Schedule of all training sessions',
    url: 'training-calendar-2024.pdf',
    hitCount: 19,
    isCascading: false,
    isPublic: true,
    realFilename: 'training-calendar-2024.pdf',
    nameWithoutHtmlTags: 'Training Calendar 2024',
    descriptionWithoutHtmlTags: 'Schedule of all training sessions',
    idWebuserCreated: 1,
    created: '2024-03-01 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 23:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'Teacher Training',
  },

  // ============================================
  // LEVEL 3: Teacher Training -> New Teacher Orientation - Resources
  // ============================================
  {
    id: 7001,
    idLibraryResourceCategory: 311,
    name: 'New Teacher Welcome Guide',
    description: 'Welcome packet for new teachers',
    url: 'new-teacher-welcome.pdf',
    hitCount: 35,
    isCascading: false,
    isPublic: true,
    realFilename: 'new-teacher-welcome.pdf',
    nameWithoutHtmlTags: 'New Teacher Welcome Guide',
    descriptionWithoutHtmlTags: 'Welcome packet for new teachers',
    idWebuserCreated: 1,
    created: '2024-03-10 09:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 10:00:00.000',
    type: ResourceType.PDF,
    categoryName: 'New Teacher Orientation',
  },
  {
    id: 7002,
    idLibraryResourceCategory: 311,
    name: 'Classroom Management Basics',
    description: 'Essential classroom management strategies',
    url: 'classroom-management-basics.pptx',
    hitCount: 28,
    isCascading: false,
    isPublic: true,
    realFilename: 'classroom-management-basics.pptx',
    nameWithoutHtmlTags: 'Classroom Management Basics',
    descriptionWithoutHtmlTags: 'Essential classroom management strategies',
    idWebuserCreated: 1,
    created: '2024-03-10 10:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 11:00:00.000',
    type: ResourceType.Link,
    categoryName: 'New Teacher Orientation',
  },
  {
    id: 7003,
    idLibraryResourceCategory: 311,
    name: 'First Year Teacher Checklist',
    description: 'Checklist for first year teachers',
    url: 'first-year-checklist.docx',
    hitCount: 24,
    isCascading: false,
    isPublic: true,
    realFilename: 'first-year-checklist.docx',
    nameWithoutHtmlTags: 'First Year Teacher Checklist',
    descriptionWithoutHtmlTags: 'Checklist for first year teachers',
    idWebuserCreated: 1,
    created: '2024-03-10 11:00:00.000',
    idWebuserLastModified: null,
    lastModified: null,
    lastAccessed: '2024-11-30 12:00:00.000',
    type: ResourceType.Link,
    categoryName: 'New Teacher Orientation',
  },
];
