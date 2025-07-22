import { ApiResponse } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { Table } from 'govuk-react';
import { ResponsePanel, WrappedCell } from './ApiResponsePanel.styles';

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
            <WrappedCell data-testid="api-response-panel-status">
              {apiResponse.status}
            </WrappedCell>
          </Table.Row>
        ) : null}

        <Table.Row>
          <Table.CellHeader>Message</Table.CellHeader>
          <WrappedCell data-testid="api-response-panel-message">
            {apiResponse.message}
          </WrappedCell>
        </Table.Row>
      </Table>
    </ResponsePanel>
  );
};
