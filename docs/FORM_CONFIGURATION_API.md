# Form Configuration API Documentation

## Tổng quan

Hệ thống API này cung cấp khả năng quản lý form configurations một cách động. Bạn có thể tạo, đọc, cập nhật và xóa các cấu hình form từ server API.

## API Endpoints

### 1. Lấy danh sách form configurations

```typescript
import { fetchFormConfigurations } from '../services/api';

const response = await fetchFormConfigurations(page, limit);
// response: FormListResponse
```

**Parameters:**

- `page` (number, optional): Số trang, mặc định = 1
- `limit` (number, optional): Số lượng items mỗi trang, mặc định = 10

**Response:**

```typescript
{
  success: boolean;
  message: string;
  data: {
    forms: FormConfiguration[];
    total: number;
    page: number;
    limit: number;
  };
}
```

### 2. Lấy form configuration theo ID

```typescript
import { fetchFormConfigurationById } from '../services/api';

const response = await fetchFormConfigurationById('form-id');
// response: FormDetailResponse
```

**Parameters:**

- `id` (string): ID của form configuration

**Response:**

```typescript
{
  success: boolean;
  message: string;
  data: FormConfiguration;
}
```

### 3. Lấy form configuration theo tên

```typescript
import { fetchFormConfigurationByName } from '../services/api';

const response = await fetchFormConfigurationByName('contact-us');
// response: FormDetailResponse
```

**Parameters:**

- `name` (string): Tên (slug) của form configuration

### 4. Tạo form configuration mới

```typescript
import { createFormConfiguration } from '../services/api';

const newForm = {
  name: 'survey-form',
  title: 'Customer Survey',
  description: 'Customer satisfaction survey',
  version: '1.0',
  fields: [
    {
      name: 'rating',
      label: 'How would you rate our service?',
      type: 'radio',
      required: true,
      options: [
        { label: 'Excellent', value: '5' },
        { label: 'Good', value: '4' },
        { label: 'Average', value: '3' },
        { label: 'Poor', value: '2' },
        { label: 'Very Poor', value: '1' },
      ],
    },
  ],
  settings: {
    allowOffline: true,
    requireAuth: false,
    maxFileSize: 5 * 1024 * 1024,
  },
};

const response = await createFormConfiguration(newForm);
```

### 5. Cập nhật form configuration

```typescript
import { updateFormConfiguration } from '../services/api';

const updates = {
  title: 'Updated Customer Survey',
  description: 'Updated description',
  // ... other fields to update
};

const response = await updateFormConfiguration('form-id', updates);
```

### 6. Xóa form configuration

```typescript
import { deleteFormConfiguration } from '../services/api';

const response = await deleteFormConfiguration('form-id');
// response: { success: boolean; message: string; }
```

### 7. Tìm kiếm form configurations

```typescript
import { searchFormConfigurations } from '../services/api';

const response = await searchFormConfigurations('survey', 1, 10);
// response: FormListResponse
```

**Parameters:**

- `query` (string): Từ khóa tìm kiếm
- `page` (number, optional): Số trang
- `limit` (number, optional): Số lượng items mỗi trang

## React Hooks

### 1. useFormConfigurations - Lấy danh sách forms

```typescript
import { useFormConfigurations } from '../hooks/useFormConfiguration';

const MyComponent = () => {
  const { data, loading, error, refetch } = useFormConfigurations(1, 10);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.forms.map(form => (
        <FormItem key={form.id} form={form} />
      ))}
    </div>
  );
};
```

### 2. useFormConfiguration - Lấy form theo ID

```typescript
import { useFormConfiguration } from '../hooks/useFormConfiguration';

const FormDetail = ({ formId }) => {
  const { data, loading, error, refetch } = useFormConfiguration(formId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <NotFound />;

  return <FormConfiguration config={data} />;
};
```

### 3. useFormConfigurationByName - Lấy form theo tên

```typescript
import { useFormConfigurationByName } from '../hooks/useFormConfiguration';

const FormByName = ({ formName }) => {
  const { data, loading, error } = useFormConfigurationByName(formName);

  // Render logic...
};
```

### 4. useFormConfigurationActions - CRUD operations

```typescript
import { useFormConfigurationActions } from '../hooks/useFormConfiguration';

const FormManager = () => {
  const { createForm, updateForm, deleteForm, loading, error } =
    useFormConfigurationActions();

  const handleCreate = async () => {
    const result = await createForm(newFormData);
    if (result.success) {
      // Handle success
    }
  };

  const handleUpdate = async (id, data) => {
    const result = await updateForm(id, data);
    if (result.success) {
      // Handle success
    }
  };

  const handleDelete = async id => {
    const result = await deleteForm(id);
    if (result.success) {
      // Handle success
    }
  };

  // Render UI...
};
```

### 5. useFormConfigurationSearch - Tìm kiếm forms

```typescript
import { useFormConfigurationSearch } from '../hooks/useFormConfiguration';

const FormSearch = () => {
  const { results, loading, error, search, clearResults } =
    useFormConfigurationSearch();

  const handleSearch = async query => {
    await search(query);
  };

  // Render search UI...
};
```

## Types và Interfaces

### FormConfiguration

```typescript
interface FormConfiguration {
  id: string;
  name: string; // Unique name/slug for the form
  title: string; // Display title
  description?: string; // Form description
  version: string; // Version number
  fields: FormField[]; // Array of form fields
  settings?: {
    allowOffline?: boolean; // Allow offline submission
    requireAuth?: boolean; // Require authentication
    maxFileSize?: number; // Max file upload size in bytes
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### FormField

```typescript
interface FormField {
  name: string; // Field name (for form data)
  label: string; // Display label
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'signature'
    | 'photo';
  required: boolean; // Is field required
  placeholder?: string; // Placeholder text
  options?: FormFieldOption[]; // Options for radio/checkbox/select
}
```

### FormFieldOption

```typescript
interface FormFieldOption {
  label: string; // Display label
  value: string; // Value when selected
}
```

## Validation

Hệ thống cung cấp validation tự động cho form configurations:

```typescript
import { validateFormConfiguration } from '../services/api';

const validation = validateFormConfiguration(formConfig);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

**Validation rules:**

- Form name và title không được để trống
- Phải có ít nhất 1 field
- Mỗi field phải có name, label và type
- Fields loại radio/checkbox/select phải có options

## Cấu hình API

### Base URLs

```typescript
// Mock API for development
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Real form API endpoints (thay đổi theo server thực tế)
const FORM_API_BASE = 'https://api.example.com/forms';
```

### Authentication

Thêm token authentication vào headers:

```typescript
headers: {
  'Authorization': 'Bearer YOUR_AUTH_TOKEN',
  'Content-Type': 'application/json'
}
```

## Demo Screen

Ứng dụng bao gồm một demo screen (`FormConfigurationScreen`) để thử nghiệm các API:

**Features:**

- Hiển thị danh sách form configurations
- Xem chi tiết form configuration
- Tìm kiếm forms
- Thao tác CRUD (Create, Read, Update, Delete)
- Responsive design cho tablet

**Navigation:**

```typescript
// Từ HomeScreen
router.push('/form-configuration');
```

## Best Practices

1. **Error Handling**: Luôn kiểm tra `success` field trong response
2. **Loading States**: Sử dụng loading states từ hooks
3. **Caching**: Sử dụng `refetch` để refresh data khi cần
4. **Validation**: Validate form data trước khi submit
5. **Offline Support**: Xử lý trường hợp không có mạng

## Example: Tạo Form Dynamic

```typescript
const DynamicFormCreator = () => {
  const { createForm, loading } = useFormConfigurationActions();

  const createContactForm = async () => {
    const formConfig = {
      name: 'contact-us',
      title: 'Contact Us',
      description: 'Get in touch with our team',
      version: '1.0',
      fields: [
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'Enter your email'
        },
        {
          name: 'subject',
          label: 'Subject',
          type: 'select',
          required: true,
          options: [
            { label: 'General Inquiry', value: 'general' },
            { label: 'Technical Support', value: 'support' },
            { label: 'Business Partnership', value: 'business' }
          ]
        },
        {
          name: 'message',
          label: 'Message',
          type: 'text',
          required: true,
          placeholder: 'Enter your message'
        }
      ],
      settings: {
        allowOffline: true,
        requireAuth: false,
        maxFileSize: 5 * 1024 * 1024 // 5MB
      }
    };

    const result = await createForm(formConfig);
    if (result.success) {
      Alert.alert('Success', 'Contact form created successfully!');
    }
  };

  return (
    <Button
      title="Create Contact Form"
      onPress={createContactForm}
      loading={loading}
    />
  );
};
```

Hệ thống API này cung cấp một giải pháp hoàn chỉnh để quản lý form configurations động, từ việc tạo forms đến việc validate và submit data!
