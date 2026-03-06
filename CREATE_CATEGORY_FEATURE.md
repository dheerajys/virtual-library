# Create Category Feature

## Overview

The Create Category feature allows users in manage mode to create new categories with hierarchical location selection and advanced configuration options.

## Components

### 1. CreateCategoryPage (`src/pages/CreateCategoryPage/`)

Main page component for creating categories with full form validation and user feedback.

**Features:**

- Form validation with error messages
- Hierarchical location selection with tree view
- Parent category selection
- Resource layout options
- Exclude locations functionality
- Save and Save & Finish actions
- Loading states and success messages

### 2. TreeSelect (`src/components/TreeSelect/`)

Reusable tree select component for single-item hierarchical selection.

**Features:**

- Expandable/collapsible tree nodes
- Visual feedback for selected items
- Folder icons with open/closed states
- Keyboard navigation support
- Error state handling
- Accessibility features

**Props:**

```typescript
interface ITreeSelectProps {
  data: ILocationNode[];
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}
```

### 3. MultiTreeSelect (`src/components/MultiTreeSelect/`)

Reusable tree select component for multiple-item selection with chips display.

**Features:**

- Multiple selection support
- Chip display for selected items
- Remove items via chip delete
- Same tree navigation as TreeSelect
- Visual feedback for all selected items

**Props:**

```typescript
interface IMultiTreeSelectProps {
  data: ILocationNode[];
  selectedIds: string[];
  onSelect: (nodeIds: string[]) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}
```

## Data Models

### ICategoryFormData

```typescript
interface ICategoryFormData {
  name: string;
  location: string;
  parentCategory: string;
  resourceLayout: 'system' | 'one-column' | 'two-columns';
  excludedLocations: string[];
}
```

### ILocationNode

```typescript
interface ILocationNode {
  id: string;
  name: string;
  type: 'root' | 'location' | 'sublocation';
  children?: ILocationNode[];
  parentId?: string;
}
```

## Navigation

### Routes

- **Create Category**: `/create-category`
- Accessible from Virtual Library page when in manage mode

### Entry Points

1. Click "Create Category" button on Virtual Library page (manage mode)
2. Direct navigation to `/create-category` URL

## Form Validation

### Rules

1. **Name**: Required, max 50 characters
2. **Location**: Required, must select from tree
3. **Parent Category**: Required (defaults to 'Home')
4. **Resource Layout**: Required (defaults to 'system')
5. **Excluded Locations**: Optional

### Error Handling

- Real-time validation on field blur
- Error messages displayed below fields
- Form submission blocked if validation fails
- Success message on successful creation

## User Flow

### Creating a Category

1. **Enter Manage Mode**

   - Click "Manage Mode" toggle on Virtual Library page

2. **Navigate to Create Category**

   - Click "Create Category" button

3. **Fill Form**

   - Enter category name (supports hierarchical names like "Main/Sub")
   - Select location from tree view
   - Choose parent category
   - Select resource layout preference
   - Optionally exclude from specific locations

4. **Save**
   - **Save**: Creates category and resets form for another entry
   - **Save and Finish**: Creates category and returns to Virtual Library
   - **Cancel**: Returns to Virtual Library without saving

## Integration Points

### Redux Store

The form will integrate with Redux for:

- Fetching location tree data
- Fetching parent categories
- Submitting category creation
- Managing form state (optional)

### API Endpoints (TODO)

```typescript
// To be implemented
POST /api/categories
{
  name: string;
  location: string;
  parentCategory: string;
  resourceLayout: string;
  excludedLocations: string[];
}
```

## Accessibility

### ARIA Labels

- All form fields have proper labels
- Tree nodes have appropriate ARIA attributes
- Error messages are announced to screen readers

### Keyboard Navigation

- Tab navigation through all form fields
- Arrow keys for tree navigation
- Enter/Space for tree node selection
- Escape to collapse expanded nodes

## Styling

### Design System

- Material-UI components
- Consistent with Virtual Library design
- Responsive layout
- Professional color scheme matching brand guidelines

### Responsive Breakpoints

- Mobile: Full-width form fields
- Tablet: Optimized spacing
- Desktop: Maximum width container (lg)

## Best Practices Followed

1. **Component Organization**

   - Single responsibility components
   - Reusable tree components
   - Clean separation of concerns

2. **TypeScript**

   - Strict typing for all props and state
   - Interface definitions for data models
   - Type safety throughout

3. **Error Handling**

   - Comprehensive validation
   - User-friendly error messages
   - Loading and disabled states

4. **User Experience**

   - Clear visual feedback
   - Intuitive navigation
   - Helpful helper text
   - Success confirmation

5. **Code Quality**
   - JSDoc comments
   - Consistent naming conventions
   - Clean code structure
   - No unused code

## Future Enhancements

1. **Form State Persistence**

   - Save draft in localStorage
   - Warn before leaving with unsaved changes

2. **Advanced Features**

   - Drag-and-drop for tree organization
   - Bulk category creation
   - Category templates
   - Preview before save

3. **Validation**

   - Check for duplicate category names
   - Validate hierarchical path syntax
   - Backend validation integration

4. **Testing**
   - Unit tests for form validation
   - Integration tests for tree selection
   - E2E tests for complete flow

## Testing Checklist

- [ ] Form validation works correctly
- [ ] Tree selection updates form state
- [ ] Multiple selection in exclude locations works
- [ ] Save creates category and resets form
- [ ] Save and Finish navigates back
- [ ] Cancel navigation works
- [ ] Error states display correctly
- [ ] Success message shows
- [ ] Loading states prevent duplicate submissions
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Responsive on all devices

## Development Notes

### Mock Data

Currently using mock data for:

- Location tree structure
- Parent categories list

Replace with actual Redux selectors when backend is ready.

### TODO Items

1. Implement actual API integration
2. Connect to Redux store for data
3. Add loading states for data fetching
4. Implement category update functionality
5. Add unit tests
6. Add E2E tests
