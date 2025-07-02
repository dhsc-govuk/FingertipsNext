'use client';

import {
  Button,
  DateField,
  FileUpload,
  H1,
  HintText,
  Input,
  Label,
  LabelText,
  Panel,
  WarningText,
} from 'govuk-react';
import styled from 'styled-components';
import Form from 'next/form';
import { uploadFile } from './uploadActions';
import { useActionState } from 'react';

// TODO: Extract stles to a style.tsx file
const InterimWarningText = styled(WarningText)({
  fontSize: '20px', // TODO: This font sizing isn't working!
  marginBottom: '50px',
});
const PageHeading = styled(H1)({ fontSize: '36px' });
const FieldLabelText = styled(LabelText)({
  fontSize: '20px',
  fontWeight: 700,
});
const FieldLabelHint = styled(HintText)({
  fontSize: '20px',
  fontWeight: 300,
});
const LabelGroup = styled(Label)({ marginBottom: '50px' });
const DateEntry = styled(DateField)({
  fontSize: '20px', // TODO: This font sizing isn't working!
  fontWeight: 700, // TODO: This font sizing isn't working!
  marginBottom: '50px',
});
const FileUploadWithMargin = styled(FileUpload)({ marginBottom: '50px' });
const SubmitContainer = styled('div')({ marginBottom: '50px' });

export const Upload = () => {
  const [state, action, pending] = useActionState(uploadFile, undefined);

  return (
    <Form action={action}>
      {state ? (
        <Panel title="Upload complete">
          {state?.status} - {state?.body}
        </Panel>
      ) : null}

      <InterimWarningText>
        This is an interim tool to allow developers to demonstrate data upload
        to the API
      </InterimWarningText>

      <PageHeading>Indicator data portal</PageHeading>

      <LabelGroup>
        <FieldLabelText>Add indicator ID</FieldLabelText>
        <FieldLabelHint>This is a unique identification number</FieldLabelHint>
        <Input name="indicatorId" />
      </LabelGroup>

      <DateEntry
        hintText="The date must be today or in the future"
        inputNames={{
          day: 'publishDateDay',
          month: 'publishDateMonth',
          year: 'publishDateYear',
        }}
      >
        {/* TODO: Need to style this text */}
        Add a publish date
      </DateEntry>

      <FileUploadWithMargin
        acceptedFormats=".csv"
        hint="The file must be the CSV format provided by this service"
        name="file"
      >
        {/* TODO: Need to style this text */}
        Upload a file
      </FileUploadWithMargin>

      <SubmitContainer>
        <Label>
          <FieldLabelText>
            Submit the uploaded file and information
          </FieldLabelText>
        </Label>
        {/* TODO: Disable button when submitted */}
        <Button>{pending ? 'Submitted' : 'Submit'}</Button>
      </SubmitContainer>
    </Form>
  );
};
