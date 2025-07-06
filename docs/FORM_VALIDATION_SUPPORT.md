# Form Validation Support in FormEditor

## Tổng quan

FormEditor hiện đã được nâng cấp với hệ thống validation toàn diện, cho phép bạn cấu hình các quy tắc validation phức tạp cho từng field trong form một cách trực quan và dễ sử dụng.

## Tính năng mới

### 1. **Enhanced Field Configuration**

- Mỗi field hiện có thể cấu hình nhiều validation rules
- Support cho custom validation messages
- Validation rules được lưu trữ cùng với form configuration

### 2. **Validation Rules được hỗ trợ**

| Rule Type        | Mô tả                | Có thể cấu hình |
| ---------------- | -------------------- | --------------- |
| `required`       | Bắt buộc nhập        | ✓               |
| `email`          | Format email hợp lệ  | ✓               |
| `phone`          | Số điện thoại hợp lệ | ✓               |
| `minLength`      | Độ dài tối thiểu     | ✓ (Nhập số)     |
| `maxLength`      | Độ dài tối đa        | ✓ (Nhập số)     |
| `pattern`        | Custom regex pattern | ✓ (Nhập regex)  |
| `positiveNumber` | Số dương             | ✓               |
| `currency`       | Format tiền tệ       | ✓               |
| `date`           | Ngày hợp lệ          | ✓               |
| `futureDate`     | Ngày trong tương lai | ✓               |
| `pastDate`       | Ngày trong quá khứ   | ✓               |

### 3. **Validation Panel**

- Panel có thể mở/đóng cho mỗi field
- Switch để bật/tắt từng validation rule
- Input fields để cấu hình giá trị cho rules (minLength, maxLength, pattern)
- **Test validation functionality với 2 modes:**
  - **Real-time test**: Nhập trực tiếp vào TextInput để test validation
  - **Quick Test**: Nhấn nút "Quick Test" để thử nghiệm với các example values
- **Clear test result**: Nút Clear để xóa kết quả test
- **Test result display**: Hiển thị kết quả validation với màu sắc (xanh=hợp lệ, đỏ=không hợp lệ)

### 4. **Validation Summary**

- Hiển thị tóm tắt validation rules của từng field
- Form-level validation overview
- Thống kê số lượng fields, required fields, và fields có validation

## Cách sử dụng

### **Bước 1: Mở Form Editor**

1. Vào màn hình Form Configuration
2. Chọn form cần edit
3. Nhấn nút "Edit"

### **Bước 2: Cấu hình Field Validation**

1. Trong phần "Form Fields", nhấn "Edit" cho field cần cấu hình
2. Scroll xuống phần "Field Validation Rules"
3. Nhấn vào header để mở/đóng validation panel

### **Bước 3: Thêm Validation Rules**

1. Bật switch cho rule cần áp dụng
2. Với rules có tham số (minLength, maxLength, pattern), nhập giá trị
3. Rule sẽ được áp dụng ngay lập tức

### **Bước 4: Test Validation Rules**

1. **Real-time Testing**: Nhập trực tiếp vào TextInput "Test this rule"
2. **Quick Test**: Nhấn nút "Quick Test" để thử nghiệm với example values
3. **Xem kết quả**: Kết quả hiển thị ngay lập tức với màu sắc rõ ràng
4. **Clear kết quả**: Nhấn "Clear" để xóa kết quả test

### **Bước 5: Xem Validation Summary**

- Validation rules sẽ hiển thị dưới mỗi field khi không ở chế độ edit
- Phần "Form Validation Summary" cho tổng quan toàn bộ form

## Ví dụ sử dụng

### **Email Field với validation**

```typescript
{
  name: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Email is required'
    },
    {
      type: 'email',
      message: 'Please enter a valid email address'
    }
  ]
}
```

### **Password Field với độ dài tối thiểu**

```typescript
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Password is required'
    },
    {
      type: 'minLength',
      value: 8,
      message: 'Password must be at least 8 characters'
    }
  ]
}
```

### **Custom Pattern Field**

```typescript
{
  name: 'username',
  label: 'Username',
  type: 'text',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Username is required'
    },
    {
      type: 'pattern',
      value: '^[a-zA-Z0-9_]+$',
      message: 'Username can only contain letters, numbers, and underscores'
    }
  ]
}
```

## Technical Implementation

### **Enhanced FormField Interface**

```typescript
interface EnhancedFormField extends FormField {
  validation?: ValidationRule[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}
```

### **Validation Rule Structure**

```typescript
interface ValidationRule {
  type: string;
  message: string;
  value?: any;
  validator?: (value: any, formState: FormState) => boolean;
  condition?: (formState: FormState) => boolean;
}
```

### **Key Functions**

- `handleValidationChange()`: Quản lý thay đổi validation rules
- `testValidationRule()`: Test validation rules
- `getDefaultValidationMessage()`: Tạo default messages
- `renderValidationSummary()`: Render validation summary

## UI Components

### **Validation Panel**

- Collapsible panel với các switches cho từng rule
- Input fields cho rules có tham số
- Test area để thử nghiệm validation

### **Validation Summary**

- Compact display của validation rules
- Form-level statistics
- Quick overview của toàn bộ form validation

### **Validation Test (Đã hoàn thành)**

- **Real-time validation testing**: Nhập trực tiếp để test validation rules
- **Quick Test với example values**: Thử nghiệm nhanh với các giá trị mẫu
- **Visual feedback cho validation results**: Hiển thị kết quả với màu sắc rõ ràng
- **Clear/Reset functionality**: Xóa kết quả test
- **Test page riêng**: Có thể test toàn bộ validation system từ Home → "🧪 Test Validation Rules"

## Testing Validation Rules

### **1. Trong FormEditor (Real-time + Quick Test)**

- **Real-time**: Nhập trực tiếp vào TextInput "Test this rule"
- **Quick Test**: Nhấn nút "Quick Test" để thử nghiệm với example values
- **Kết quả**: Hiển thị ngay lập tức với màu sắc rõ ràng

### **2. Validation Test Screen**

- Truy cập: Home → "🧪 Test Validation Rules"
- Test tất cả validation rules một lần
- Xem kết quả trong Alert popup
- Dành cho developers để debug validation system

### **3. Validation Examples cho Quick Test**

```typescript
const examples = {
  required: ['', 'hello', ' '],
  email: ['test@example.com', 'invalid-email', 'user@domain'],
  phone: ['+1234567890', '123-456-7890', 'not-a-phone'],
  minLength: ['short', 'this is long enough', 'a'],
  maxLength: ['ok', 'this text is way too long', 'short'],
  pattern: ['valid123', 'invalid@#$', 'test_user'],
  positiveNumber: ['42', '-5', '0', '3.14'],
  currency: ['19.99', '100', 'not-money'],
  date: ['2023-12-25', '2023/12/25', 'not-a-date'],
  futureDate: ['2030-01-01', '2020-01-01'],
  pastDate: ['2020-01-01', '2030-01-01'],
};
```

## Best Practices

### **1. Message Design**

- Sử dụng messages rõ ràng, dễ hiểu
- Đưa ra hướng dẫn cụ thể cho user
- Tránh technical jargon

### **2. Rule Combinations**

- Combine multiple rules cho validation mạnh mẽ
- Test thoroughly với different input scenarios
- Consider edge cases

### **3. User Experience**

- Validation feedback should be immediate
- Progressive disclosure của validation complexity
- Clear visual hierarchy

## Future Enhancements

### **Planned Features**

- [ ] ~~Real-time validation testing trong editor~~ ✅ **HOÀN THÀNH**
- [ ] ~~Visual validation result feedback~~ ✅ **HOÀN THÀNH**
- [ ] ~~Quick Test với example values~~ ✅ **HOÀN THÀNH**
- [ ] Custom validation function editor
- [ ] Conditional validation rules
- [ ] Cross-field validation dependencies
- [ ] Validation templates và presets
- [ ] Import/export validation configurations

### **Performance Optimization**

- [ ] Lazy loading của validation rules
- [ ] Memoization của validation results
- [ ] Optimized re-rendering

## Troubleshooting

### **Common Issues**

**Q: Validation rules không được save?**
A: Đảm bảo đã nhấn "Save" ở form editor và check network connection.

**Q: "test this rule" không hoạt động?**
A: ✅ **ĐÃ KHẮC PHỤC** - Đã thêm:

- Real-time test input với kết quả hiển thị ngay lập tức
- Nút "Quick Test" với example values và Alert hiển thị kết quả
- Nút "Clear" để xóa kết quả test
- Visual feedback với màu sắc rõ ràng (xanh=hợp lệ, đỏ=không hợp lệ)
- Test page riêng tại Home → "🧪 Test Validation Rules"

**Q: Performance chậm với nhiều validation rules?**
A: Consider reducing số lượng complex rules hoặc optimize validation logic.

## API Integration

### **Save Enhanced Form**

```typescript
const formDataWithValidation = {
  ...formData,
  fields: formData.fields.map(field => ({
    ...field,
    validation: field.validation || [],
  })),
};

await onSave(formDataWithValidation);
```

### **Validate Form Data**

```typescript
import { validateField } from '../utils/validation';

const validateForm = (formData, formConfig) => {
  const errors = {};

  formConfig.fields.forEach(field => {
    const error = validateField(
      field.name,
      formData[field.name],
      field,
      formData
    );

    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
};
```

Hệ thống validation này cung cấp một giải pháp toàn diện cho việc cấu hình và quản lý validation rules trong dynamic forms, giúp đảm bảo data quality và user experience tốt hơn! 🎉
