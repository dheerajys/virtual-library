# Virtual Library API Integration

## Overview

The Virtual Library application is integrated with a backend API to fetch categories and resources. The implementation includes automatic fallback to mock data when the API is unavailable.

## API Configuration

### Environment Setup

1. Copy `.env.example` to `.env`:

   ```bash
   copy .env.example .env
   ```

2. Update the `VITE_API_BASE_URL` in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

## API Endpoints

### GET /library

Fetches categories and resources for a specific lineage path.

**Query Parameters:**

- `lineage` (required): The category lineage path (e.g., `/Home/`, `/Home/Board Documents/`)
- `categoryName` (optional): The category name (empty for home)

**Response:**

```json
{
  "categories": [
    {
      "id": 1,
      "idParent": null,
      "idLocation": 1,
      "name": "Home",
      "lineage": "/",
      "depth": 0,
      "displayColumns": null,
      "lineagePlusName": "/Home/",
      "resourceCount": 0
    }
  ],
  "resources": [
    {
      "id": 1,
      "idLibraryResourceCategory": 2,
      "name": "Sample Document",
      "description": "Description here",
      "url": "https://example.com/doc.pdf",
      "hitCount": 100,
      "type": "PDF",
      "created": "2024-01-01T00:00:00Z",
      "lastModified": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### Other Available Endpoints

- `GET /categories` - Get all categories
- `GET /resources` - Get all resources
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category
- `POST /resources` - Create a new resource
- `PUT /resources/:id` - Update a resource
- `DELETE /resources/:id` - Delete a resource

## Implementation Details

### RTK Query API Service

Located in `src/services/virtualLibraryApi.ts`, this file contains:

- API endpoint definitions using RTK Query
- Type-safe request/response interfaces
- Automatic caching and invalidation
- Error handling

### Custom Hook

`useVirtualLibrary` hook (`src/hooks/useVirtualLibrary.ts`):

- Automatically calls API on component mount
- Falls back to mock data if API fails
- Manages loading states
- Dispatches data to Redux store

### Navigation Flow

1. **Initial Load**: Calls API with `lineage="/Home/"` and `categoryName=""`
2. **Category Click**: Calls API with updated lineage (e.g., `lineage="/Home/Board Documents/"` and `categoryName="Board Documents"`)
3. **Breadcrumb Navigation**: Calls API with the lineage of the clicked breadcrumb

### Mock Data Fallback

The application uses mock data from `src/data/mockVirtualLibraryData.ts` when:

- API is not configured
- API call fails (network error, timeout, etc.)
- API returns no data

A notification banner appears when using mock data.

## Usage Example

```tsx
import { useVirtualLibrary } from '../hooks';

function MyComponent() {
  const { isLoading, isUsingMockData } = useVirtualLibrary('/Home/', '');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isUsingMockData && <Alert>Using mock data</Alert>}
      {/* Your component content */}
    </div>
  );
}
```

## Testing

### With Mock Data (Default)

Simply run the application without configuring the API:

```bash
npm run dev
```

### With Real API

1. Ensure your backend API is running
2. Configure `.env` with correct API URL
3. Run the application:

```bash
npm run dev
```

## Error Handling

The application handles errors gracefully:

- Network errors: Falls back to mock data
- Invalid responses: Falls back to mock data
- Missing data: Shows empty state with appropriate messaging
- Loading states: Shows loading indicators

## Best Practices Implemented

1. **Type Safety**: Full TypeScript typing for requests and responses
2. **Caching**: RTK Query automatic caching reduces redundant API calls
3. **Error Handling**: Graceful degradation to mock data
4. **Loading States**: Proper loading indicators for better UX
5. **Tag-based Invalidation**: Automatic cache invalidation on mutations
6. **Environment Configuration**: Configurable API endpoints via environment variables
7. **Separation of Concerns**: API logic separate from UI components
8. **Mock Data Parity**: Mock data structure matches real API response
