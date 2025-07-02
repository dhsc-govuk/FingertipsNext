'use client';

import {
  Button,
  DateField,
  FileUpload,
  H1,
  InputField,
  Table,
  WarningText,
} from 'govuk-react';
import styled from 'styled-components';
import Form from 'next/form';
import { uploadFile } from './uploadActions';
import { useActionState } from 'react';

// TODO: Extract stles to a style.tsx file
const UploadPageText = styled('span')({ fontSize: '20px' });
const InterimWarning = styled(WarningText)({
  marginBottom: '50px',
});
const ApiResponsePanel = styled('div')({
  marginBottom: '50px',
  borderColor: '#1D70B8',
  borderWidth: '5px',
  borderStyle: 'solid',
  padding: '15px',
});
const PageHeading = styled(H1)({ fontSize: '36px' });
const FieldLabel = styled('div')({
  fontSize: '20px',
  fontWeight: 700,
});
const FieldLabelWithSpacing = styled(FieldLabel)({
  marginBottom: '19px',
});
const InputFieldWithSpacing = styled(InputField)({ marginBottom: '50px' });
const DateEntry = styled(DateField)({
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
    <>
      <InterimWarning>
        <UploadPageText>
          This is an interim tool to allow developers to demonstrate data upload
          to the API
        </UploadPageText>
      </InterimWarning>

      {uploadResponse ? (
        <ApiResponsePanel>
          <Table caption="Upload results">
            {uploadResponse.status ? (
              <Table.Row>
                <Table.CellHeader>Status</Table.CellHeader>
                <Table.Cell>{uploadResponse.status}</Table.Cell>
              </Table.Row>
            ) : null}

            <Table.Row>
              <Table.CellHeader>Message</Table.CellHeader>
              <Table.Cell>{uploadResponse.message}</Table.Cell>
            </Table.Row>
          </Table>
        </ApiResponsePanel>
      ) : null}

      <PageHeading>Indicator data portal</PageHeading>

      <Form action={uploadFileAction}>
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
    </>
  );
};
