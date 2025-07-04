import styled from 'styled-components';
import { DateField, FileUpload, InputField } from 'govuk-react';

export const InputFieldWithSpacing = styled(InputField)({
  marginBottom: '50px',
});

export const FieldLabel = styled('div')({
  fontSize: '20px',
  fontWeight: 700,
});
export const FieldLabelWithSpacing = styled(FieldLabel)({
  marginBottom: '19px',
});

export const DateEntry = styled(DateField)({
  marginBottom: '50px',
});

export const FileUploadWithMargin = styled(FileUpload)({
  marginBottom: '50px',
});
export const SubmitContainer = styled('div')({ marginBottom: '50px' });
