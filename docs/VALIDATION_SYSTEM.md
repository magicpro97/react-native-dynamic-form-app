# 🔧 Advanced Form Validation System

## 📋 Overview

This document describes the advanced form validation system with customizable validation rules, business logic support, and field dependencies.

## 🎯 Features

### ✅ **Built-in Validators**
- **Required**: Field must have a value
- **Email**: Valid email format
- **Phone**: Valid phone number format
- **MinLength/MaxLength**: String length validation
- **Pattern**: Custom regex patterns
- **Custom**: Custom validation functions

### ✅ **Business Logic Support**
- **Conditional validation**: Rules based on other fields
- **Cross-field validation**: Password confirmation, date ranges
- **Dynamic requirements**: Required fields based on selections
- **Custom error messages**: Tailored to business context

### ✅ **Enhanced User Experience**
- **Real-time validation**: Immediate feedback
- **Field dependencies**: Auto-validate related fields
- **Debounced validation**: Avoid excessive calls
- **Clear error messages**: User-friendly feedback

## 🏗️ Architecture

### **Core Components**

```typescript
// Validation Rule Interface
interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom' | 'conditional';
  message: string;
  value?: any;
  validator?: (value: any, formState: FormState) => boolean;
  condition?: (formState: FormState) => boolean;
}

// Field Configuration
interface FieldConfig extends FormField {
  validation?: ValidationRule[];
  customValidation?: (value: any, formState: FormState) => string | null;
  dependsOn?: string[];
}
```

### **Validation Flow**

```
Field Value Change → Validate Field → Check Dependencies → Update Errors → UI Update
```

## 🛠️ Usage Examples

### **Basic Validation**

```typescript
const emailField: FieldConfig = {
  name: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Email is required',
    },
    {
      type: 'email',
      message: 'Please enter a valid email address',
    },
  ],
};
```

### **Business Logic Validation**

```typescript
const ageField: FieldConfig = {
  name: 'age',
  label: 'Age',
  type: 'number',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Age is required',
    },
    {
      type: 'custom',
      message: 'Age must be between 18 and 120',
      validator: (value) => {
        const age = parseInt(value);
        return age >= 18 && age <= 120;
      },
    },
  ],
  customValidation: (age, formState) => {
    const ageNum = parseInt(age);
    const category = formState.category;

    if (category === 'child' && ageNum >= 18) {
      return 'Age must be under 18 for child category';
    }
    if (category === 'adult' && ageNum < 18) {
      return 'Age must be 18 or older for adult category';
    }
    return null;
  },
  dependsOn: ['category'],
};
```

### **Conditional Validation**

```typescript
const companyNameField: FieldConfig = {
  name: 'companyName',
  label: 'Company Name',
  type: 'text',
  required: false,
  validation: [
    {
      type: 'conditional',
      message: 'Company name is required for business customers',
      condition: (formState) => formState.category === 'business',
      validator: (value) => value && value.trim().length > 0,
    },
  ],
};
```

### **Password Confirmation**

```typescript
const confirmPasswordField: FieldConfig = {
  name: 'confirmPassword',
  label: 'Confirm Password',
  type: 'password',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Please confirm your password',
    },
  ],
  customValidation: (confirmPassword, formState) => {
    if (confirmPassword !== formState.password) {
      return 'Passwords do not match';
    }
    return null;
  },
  dependsOn: ['password'],
};
```

## 🎨 Custom Validators

### **Built-in Validators**

```typescript
export const validators = {
  required: (value: any) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  minLength: (value: string, minLength: number) => {
    return value.length >= minLength;
  },

  maxLength: (value: string, maxLength: number) => {
    return value.length <= maxLength;
  },

  pattern: (value: string, pattern: RegExp) => {
    return pattern.test(value);
  },
};
```

### **Business Validators**

```typescript
export const businessValidators = {
  // Age validation based on category
  validateAge: (age: string, formState: FormState) => {
    const ageNum = parseInt(age);
    const category = formState.category;

    if (category === 'child' && ageNum >= 18) {
      return 'Age must be under 18 for child category';
    }
    if (category === 'adult' && ageNum < 18) {
      return 'Age must be 18 or older for adult category';
    }
    return null;
  },

  // Salary validation based on position
  validateSalary: (salary: string, formState: FormState) => {
    const salaryNum = parseFloat(salary);
    const position = formState.position;

    const minSalaries = {
      'intern': 1000,
      'junior': 3000,
      'senior': 5000,
      'manager': 8000,
    };

    const minSalary = minSalaries[position];
    if (minSalary && salaryNum < minSalary) {
      return `Minimum salary for ${position} is $${minSalary}`;
    }
    return null;
  },

  // Date range validation
  validateDateRange: (endDate: string, formState: FormState) => {
    const start = new Date(formState.startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return 'End date must be after start date';
    }
    return null;
  },
};
```

## 🔧 Integration

### **Using with React Hook**

```typescript
import { useValidation } from '../hooks/useValidation';

const FormComponent = () => {
  const { validateAllFields, validateSingleField } = useValidation(fieldConfigs);

  const handleSubmit = () => {
    const isValid = validateAllFields();
    if (isValid) {
      // Submit form
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setField(fieldName, value);
    validateSingleField(fieldName, value);
  };

  return (
    // Form JSX
  );
};
```

### **Form Configuration**

```typescript
// Define your form fields with validation
const formFields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' },
    ],
  },
  // ... more fields
];

// Use in component
<FormProvider>
  <FormWithValidation fields={formFields} />
</FormProvider>
```

## 🚀 Advanced Features

### **Complex Business Logic**

```typescript
// Multi-field validation
const validateComplexLogic = (formState: FormState) => {
  const errors: FormErrors = {};

  // Example: Credit application validation
  if (formState.loanAmount > formState.monthlyIncome * 12 * 5) {
    errors.loanAmount = 'Loan amount cannot exceed 5x annual income';
  }

  // Example: Insurance validation
  if (formState.age > 65 && formState.coverageType === 'life') {
    errors.coverageType = 'Life insurance not available for age > 65';
  }

  return errors;
};
```

### **Real-time Validation**

```typescript
// Debounced validation
const useValidation = (fieldConfigs: FieldConfig[]) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Validate after 300ms of inactivity
      validateAllFields();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formState]);
};
```

### **Async Validation**

```typescript
// Server-side validation
const validateEmailUnique = async (email: string) => {
  try {
    const response = await fetch(`/api/validate-email?email=${email}`);
    const data = await response.json();
    return data.isUnique ? null : 'Email already exists';
  } catch (error) {
    return 'Unable to validate email';
  }
};
```

## 📱 UI Components

### **Enhanced SignatureField (Web Compatible)**

```typescript
// Web-compatible signature field
const SignatureField = ({ field }) => {
  const webStyle = `
    .m-signature-pad {
      width: 100%;
      height: 100%;
      border: none;
      background-color: white;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `;

  return (
    <SignatureScreen
      webStyle={webStyle}
      backgroundColor="white"
      penColor="black"
      androidHardwareAccelerationDisabled={Platform.OS === 'web'}
    />
  );
};
```

### **PasswordField with Visibility Toggle**

```typescript
const PasswordField = ({ field }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.passwordContainer}>
      <TextInput
        secureTextEntry={!showPassword}
        // ... other props
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text>{showPassword ? '🙈' : '👁️'}</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🧪 Testing

### **Unit Tests**

```typescript
describe('Validation System', () => {
  test('should validate required fields', () => {
    const field = { name: 'email', type: 'email', required: true };
    const error = validateField('email', '', field, {});
    expect(error).toBe('Email is required');
  });

  test('should validate business logic', () => {
    const formState = { category: 'child', age: '25' };
    const error = businessValidators.validateAge('25', formState);
    expect(error).toBe('Age must be under 18 for child category');
  });
});
```

### **Integration Tests**

```typescript
describe('Form Integration', () => {
  test('should validate dependent fields', () => {
    const { validateDependentFields } = useValidation(fieldConfigs);
    
    // Change password
    setField('password', 'newpassword');
    
    // Should validate confirm password
    validateDependentFields('password');
    
    expect(getFieldError('confirmPassword')).toBe('Passwords do not match');
  });
});
```

## 📊 Performance Optimizations

### **Debounced Validation**
- Validation runs 300ms after user stops typing
- Prevents excessive API calls
- Improves user experience

### **Smart Dependencies**
- Only validate fields that depend on changed field
- Reduces unnecessary validation calls
- Maintains form responsiveness

### **Memoized Validators**
- Cache validation results
- Skip redundant validations
- Optimize re-renders

## 🔮 Future Enhancements

### **Advanced Features**
- **Schema validation**: JSON Schema integration
- **Internationalization**: Multi-language error messages
- **Accessibility**: Screen reader support
- **Analytics**: Track validation patterns
- **Performance**: Web Workers for complex validation

### **Integration Options**
- **Backend validation**: Server-side rule sync
- **Third-party services**: External validation APIs
- **Machine learning**: Smart validation suggestions
- **Real-time collaboration**: Multi-user form editing

---

## 📚 API Reference

### **ValidationRule Interface**

```typescript
interface ValidationRule {
  type: string;           // Validation type
  message: string;        // Error message
  value?: any;           // Validation parameter
  validator?: Function;   // Custom validator
  condition?: Function;   // Conditional logic
}
```

### **FieldConfig Interface**

```typescript
interface FieldConfig extends FormField {
  validation?: ValidationRule[];
  customValidation?: Function;
  dependsOn?: string[];
}
```

### **Built-in Validators**

- `validators.required(value)` - Check if value exists
- `validators.email(value)` - Validate email format
- `validators.phone(value)` - Validate phone number
- `validators.minLength(value, min)` - Check minimum length
- `validators.maxLength(value, max)` - Check maximum length
- `validators.pattern(value, regex)` - Pattern matching

### **Business Validators**

- `businessValidators.validateAge(age, formState)` - Age category validation
- `businessValidators.validateSalary(salary, formState)` - Position salary validation
- `businessValidators.validateDateRange(endDate, formState)` - Date range validation
- `businessValidators.validatePasswordConfirmation(confirm, formState)` - Password matching

---

*This validation system provides a comprehensive solution for form validation with business logic support, making it suitable for complex enterprise applications.*
