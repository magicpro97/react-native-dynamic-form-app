import React from 'react';
import { FormField } from '../../types/form';
import { TextInputField } from './TextInputField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { SelectField } from './SelectField';
import { SignatureField } from './SignatureField';
import { PhotoField } from './PhotoField';

interface DynamicFieldProps {
  field: FormField;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field }) => {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return <TextInputField field={field} />;
    case 'radio':
      return <RadioField field={field} />;
    case 'checkbox':
      return <CheckboxField field={field} />;
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
