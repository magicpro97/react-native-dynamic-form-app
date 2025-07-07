import React from 'react';
import { FormField } from '../../types/form';
import { useForm } from '../../context/FormContext';
import { ResponsiveTextInput } from './ResponsiveTextInput';
import { ResponsiveRadioField } from './ResponsiveRadioField';
import { ResponsiveCheckboxField } from './ResponsiveCheckboxField';
import { SelectField } from './SelectField';
import { SignatureField } from './SignatureField';
import { PhotoField } from './PhotoField';
import { PasswordField } from './PasswordField';

interface DynamicFieldProps {
  field: FormField;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field }) => {
  const { errors } = useForm();
  const error = errors[field.name];

  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <ResponsiveTextInput field={field} error={error} />;
    case 'password':
      return <PasswordField field={field} />;
    case 'radio':
      return <ResponsiveRadioField field={field} error={error} />;
    case 'checkbox':
      return <ResponsiveCheckboxField field={field} error={error} />;
    case 'select':
      return <SelectField field={field} />;
    case 'signature':
      return <SignatureField field={field} />;
    case 'photo':
      return <PhotoField field={field} />;
    default:
      return null;
  }
};
