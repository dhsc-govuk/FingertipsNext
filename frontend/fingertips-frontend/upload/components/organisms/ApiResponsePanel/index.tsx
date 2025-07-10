import { ApiResponse } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { Table } from 'govuk-react';
import { ResponsePanel } from './ApiResponsePanel.styles';

type ApiResponsePanelProps = {
  apiResponse: ApiResponse;
};

export const ApiResponsePanel = ({ apiResponse }: ApiResponsePanelProps) => {
  return (
    <ResponsePanel>
      <Table data-testid="api-response-panel">
        {apiResponse.status ? (
          <Table.Row>
            <Table.CellHeader>HTTP status code</Table.CellHeader>
            <Table.Cell data-testid="api-response-panel-status">
              {apiResponse.status}
            </Table.Cell>
          </Table.Row>
        ) : null}

        <Table.Row>
          <Table.CellHeader>Message</Table.CellHeader>
          <Table.Cell data-testid="api-response-panel-message">
            {apiResponse.message}
          </Table.Cell>
        </Table.Row>
      </Table>
    </ResponsePanel>
  );
};
