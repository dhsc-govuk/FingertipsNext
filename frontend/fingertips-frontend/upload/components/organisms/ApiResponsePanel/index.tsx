import { Table } from 'govuk-react';
import { ApiResponse } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { ResponsePanel } from './ApiResponsePanel.styles';

type ApiResponsePanelProps = {
  apiResponse: ApiResponse;
};

export const ApiResponsePanel = ({ apiResponse }: ApiResponsePanelProps) => {
  return (
    <>
      <ResponsePanel>
        <Table>
          {apiResponse.status ? (
            <Table.Row>
              <Table.CellHeader>Status</Table.CellHeader>
              <Table.Cell>{apiResponse.status}</Table.Cell>
            </Table.Row>
          ) : null}

          <Table.Row>
            <Table.CellHeader>Message</Table.CellHeader>
            <Table.Cell>{apiResponse.message}</Table.Cell>
          </Table.Row>
        </Table>
      </ResponsePanel>
    </>
  );
};
