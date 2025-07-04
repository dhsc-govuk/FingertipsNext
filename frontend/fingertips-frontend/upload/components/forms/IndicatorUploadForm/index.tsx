import { Button } from 'govuk-react';
import Form from 'next/form';
import {
  DateEntry,
  FieldLabel,
  FieldLabelWithSpacing,
  FileUploadWithMargin,
  InputFieldWithSpacing,
  SubmitContainer,
} from './IndicatorUploadForm.styles';

type UploadFormProps = {
  action: (payload: FormData) => void;
  uploadPending: boolean;
};

export const IndicatorUploadForm = ({
  action,
  uploadPending,
}: Readonly<UploadFormProps>) => {
  return (
    <Form action={action}>
      <InputFieldWithSpacing
        hint="This is a unique identification number"
        input={{ name: 'indicatorId', type: 'number' }}
      >
        <FieldLabel>Add indicator ID</FieldLabel>
      </InputFieldWithSpacing>

      <DateEntry
        hintText="The date must be today or in the future"
        inputs={{
          day: { name: 'publishDateDay', type: 'number' },
          month: { name: 'publishDateMonth', type: 'number' },
          year: { name: 'publishDateYear', type: 'number' },
        }}
      >
        <FieldLabel>Add a publish date</FieldLabel>
      </DateEntry>

      <FileUploadWithMargin
        acceptedFormats=".csv"
        hint="The file must be the CSV format provided by this service"
        name="file"
      >
        <FieldLabel>Upload a file</FieldLabel>
      </FileUploadWithMargin>

      <SubmitContainer>
        <FieldLabelWithSpacing>
          Submit the uploaded file and information
        </FieldLabelWithSpacing>
        <Button disabled={uploadPending}>Submit</Button>
      </SubmitContainer>
    </Form>
  );
};
