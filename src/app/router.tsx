import React, { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const VirtualLibraryPage = lazy(
  () => import('pages/VirtualLibraryPage/VirtualLibraryPage')
);

const CreateCategoryPage = lazy(() => import('pages/CreateCategoryPage'));
const CreateResourcePage = lazy(() => import('pages/CreateResourcePage'));

export const ROUTES = {
  root: '/',
  virtualLibrary: '/virtual-library',
  createCategory: '/create-category',
  editCategory: '/edit-category/:id',
  createResource: '/create-resource',
  editResource: '/edit-resource/:id',
};

const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <VirtualLibraryPage />,
  },
  {
    path: ROUTES.virtualLibrary,
    element: <VirtualLibraryPage />,
  },
  {
    path: ROUTES.createCategory,
    element: <CreateCategoryPage />,
  },
  {
    path: ROUTES.editCategory,
    element: <CreateCategoryPage />,
  },
  {
    path: ROUTES.createResource,
    element: <CreateResourcePage />,
  },
  {
    path: ROUTES.editResource,
    element: <CreateResourcePage />,
  },
]);

export default router;
