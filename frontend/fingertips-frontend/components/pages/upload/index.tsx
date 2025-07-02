'use client';

import {
  Button,
  DateField,
  FileUpload,
  H1,
  InputField,
  Label,
  LabelText,
  Table,
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
const ApiResponsePanel = styled('div')({
  marginBottom: '50px',
  borderColor: '#D4351C', // #00703C for green
  borderWidth: '5px',
  borderStyle: 'solid',
  padding: '15px',
});
const PageHeading = styled(H1)({ fontSize: '36px' });
const FieldLabelText = styled(LabelText)({
  fontSize: '20px',
  fontWeight: 700,
});
const InputFieldWithSpacing = styled(InputField)({ marginBottom: '50px' });
const DateEntry = styled(DateField)({
  fontSize: '20px', // TODO: This font sizing isn't working!
  fontWeight: 700, // TODO: This font sizing isn't working!
  marginBottom: '50px',
});
const FileUploadWithMargin = styled(FileUpload)({ marginBottom: '50px' });
const SubmitContainer = styled('div')({ marginBottom: '50px' });

export const Upload = () => {
  const [uploadResponse, uploadFileAction, uploadPending] = useActionState(
    uploadFile,
    undefined
  );

  return (
    <Form action={uploadFileAction}>
      <InterimWarningText>
        This is an interim tool to allow developers to demonstrate data upload
        to the API
      </InterimWarningText>

      {uploadResponse ? (
        <ApiResponsePanel>
          <Table caption="API Response">
            <Table.Row>
              <Table.CellHeader>Status</Table.CellHeader>
              <Table.Cell>{uploadResponse.status}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.CellHeader>Body</Table.CellHeader>
              <Table.Cell>{uploadResponse.body}</Table.Cell>
            </Table.Row>
          </Table>
        </ApiResponsePanel>
      ) : null}

      <PageHeading>Indicator data portal</PageHeading>

      <InputFieldWithSpacing
        hint="This is a unique identification number"
        input={{ name: 'indicatorId', type: 'number' }}
      >
        <Label>
          <FieldLabelText>Add indicator ID</FieldLabelText>
        </Label>
      </InputFieldWithSpacing>

      <DateEntry
        hintText="The date must be today or in the future"
        inputs={{
          day: { name: 'publishDateDay', type: 'number' },
          month: { name: 'publishDateMonth', type: 'number' },
          year: { name: 'publishDateYear', type: 'number' },
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
        <Button disabled={uploadPending}>Submit</Button>
      </SubmitContainer>
    </Form>
  );
};
