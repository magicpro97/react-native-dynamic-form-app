import { FieldConfig } from '../utils/validation';
import { businessValidators } from '../utils/validation';

// Example: Customer Registration Form
export const customerRegistrationFields: FieldConfig[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your first name',
    validation: [
      {
        type: 'required',
        message: 'First name is required',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'First name must be at least 2 characters',
      },
      {
        type: 'maxLength',
        value: 50,
        message: 'First name cannot exceed 50 characters',
      },
    ],
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your last name',
    validation: [
      {
        type: 'required',
        message: 'Last name is required',
      },
      {
        type: 'minLength',
        value: 2,
        message: 'Last name must be at least 2 characters',
      },
    ],
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'Enter your email address',
    validation: [
      {
        type: 'required',
        message: 'Email address is required',
      },
      {
        type: 'email',
        message: 'Please enter a valid email address',
      },
    ],
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    required: true,
    placeholder: 'Enter your phone number',
    validation: [
      {
        type: 'required',
        message: 'Phone number is required',
      },
      {
        type: 'phone',
        message: 'Please enter a valid phone number',
      },
    ],
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: true,
    placeholder: 'Enter your age',
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
  },
  {
    name: 'category',
    label: 'Customer Category',
    type: 'select',
    required: true,
    options: [
      { label: 'Individual', value: 'individual' },
      { label: 'Business', value: 'business' },
      { label: 'Enterprise', value: 'enterprise' },
    ],
    validation: [
      {
        type: 'required',
        message: 'Please select a customer category',
      },
    ],
  },
  {
    name: 'companyName',
    label: 'Company Name',
    type: 'text',
    required: false,
    placeholder: 'Enter company name',
    validation: [
      {
        type: 'conditional',
        message: 'Company name is required for business customers',
        condition: (formState) => formState.category === 'business' || formState.category === 'enterprise',
        validator: (value) => value && value.trim().length > 0,
      },
    ],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    placeholder: 'Enter your password',
    validation: [
      {
        type: 'required',
        message: 'Password is required',
      },
      {
        type: 'minLength',
        value: 8,
        message: 'Password must be at least 8 characters',
      },
      {
        type: 'pattern',
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    placeholder: 'Confirm your password',
    validation: [
      {
        type: 'required',
        message: 'Please confirm your password',
      },
    ],
    customValidation: businessValidators.validatePasswordConfirmation,
    dependsOn: ['password'],
  },
  {
    name: 'signature',
    label: 'Digital Signature',
    type: 'signature',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Digital signature is required',
      },
    ],
    customValidation: businessValidators.validateSignature,
  },
  {
    name: 'agreeTerms',
    label: 'I agree to the Terms and Conditions',
    type: 'checkbox',
    required: true,
    validation: [
      {
        type: 'custom',
        message: 'You must agree to the terms and conditions',
        validator: (value) => value === true,
      },
    ],
  },
];

// Example: Job Application Form
export const jobApplicationFields: FieldConfig[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Full name is required',
      },
      {
        type: 'minLength',
        value: 3,
        message: 'Full name must be at least 3 characters',
      },
    ],
  },
  {
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
  },
  {
    name: 'position',
    label: 'Position Applied For',
    type: 'select',
    required: true,
    options: [
      { label: 'Intern', value: 'intern' },
      { label: 'Junior Developer', value: 'junior' },
      { label: 'Senior Developer', value: 'senior' },
      { label: 'Team Manager', value: 'manager' },
    ],
    validation: [
      {
        type: 'required',
        message: 'Please select a position',
      },
    ],
  },
  {
    name: 'experience',
    label: 'Years of Experience',
    type: 'number',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Experience is required',
      },
      {
        type: 'custom',
        message: 'Experience must be between 0 and 50 years',
        validator: (value) => {
          const exp = parseInt(value);
          return exp >= 0 && exp <= 50;
        },
      },
    ],
  },
  {
    name: 'expectedSalary',
    label: 'Expected Salary (USD)',
    type: 'number',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Expected salary is required',
      },
      {
        type: 'custom',
        message: 'Please enter a valid salary amount',
        validator: (value) => {
          const salary = parseFloat(value);
          return salary > 0 && salary <= 1000000;
        },
      },
    ],
    customValidation: businessValidators.validateSalary,
    dependsOn: ['position'],
  },
  {
    name: 'availability',
    label: 'When can you start?',
    type: 'text',
    required: true,
    placeholder: 'e.g., Immediately, 2 weeks notice, etc.',
    validation: [
      {
        type: 'required',
        message: 'Availability is required',
      },
    ],
  },
  {
    name: 'coverLetter',
    label: 'Cover Letter',
    type: 'text',
    required: false,
    placeholder: 'Tell us why you want to work here...',
    validation: [
      {
        type: 'maxLength',
        value: 1000,
        message: 'Cover letter cannot exceed 1000 characters',
      },
    ],
  },
];

// Example: Event Registration Form
export const eventRegistrationFields: FieldConfig[] = [
  {
    name: 'participantName',
    label: 'Participant Name',
    type: 'text',
    required: true,
    validation: [
      {
        type: 'required',
        message: 'Participant name is required',
      },
    ],
  },
  {
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
  },
  {
    name: 'eventType',
    label: 'Event Type',
    type: 'radio',
    required: true,
    options: [
      { label: 'Conference', value: 'conference' },
      { label: 'Workshop', value: 'workshop' },
      { label: 'Seminar', value: 'seminar' },
    ],
    validation: [
      {
        type: 'required',
        message: 'Please select an event type',
      },
    ],
  },
  {
    name: 'ticketType',
    label: 'Ticket Type',
    type: 'select',
    required: true,
    options: [
      { label: 'Early Bird - $99', value: 'earlybird' },
      { label: 'Regular - $149', value: 'regular' },
      { label: 'VIP - $299', value: 'vip' },
    ],
    validation: [
      {
        type: 'required',
        message: 'Please select a ticket type',
      },
    ],
  },
  {
    name: 'specialRequests',
    label: 'Special Dietary Requirements',
    type: 'checkbox',
    required: false,
    options: [
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Gluten-free', value: 'gluten-free' },
      { label: 'Halal', value: 'halal' },
    ],
  },
  {
    name: 'emergencyContact',
    label: 'Emergency Contact Name',
    type: 'text',
    required: false,
    validation: [
      {
        type: 'conditional',
        message: 'Emergency contact is required for VIP tickets',
        condition: (formState) => formState.ticketType === 'vip',
        validator: (value) => value && value.trim().length > 0,
      },
    ],
  },
  {
    name: 'emergencyPhone',
    label: 'Emergency Contact Phone',
    type: 'text',
    required: false,
    validation: [
      {
        type: 'conditional',
        message: 'Emergency contact phone is required for VIP tickets',
        condition: (formState) => formState.ticketType === 'vip',
        validator: (value) => value && value.trim().length > 0,
      },
      {
        type: 'phone',
        message: 'Please enter a valid phone number',
      },
    ],
  },
];

// Export all configurations
export const formConfigurations = {
  customerRegistration: customerRegistrationFields,
  jobApplication: jobApplicationFields,
  eventRegistration: eventRegistrationFields,
};
