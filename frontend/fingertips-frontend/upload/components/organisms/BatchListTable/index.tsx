import { Batch } from '@/generated-sources/ft-api-client';
import { Table, Button, H4 } from 'govuk-react';
import React from 'react';
import { deleteBatch } from '../../forms/IndicatorUploadForm/uploadActions';

type BatchListTableProps = {
  batches: Batch[];
};

export enum BatchListTableHeaders {
  OriginalFilename = 'Original filename',
  Timestamp = 'Timestamp',
  UserId = 'User ID',
  PublishDate = 'Publish date',
  IndicatorId = 'Indicator ID',
  BatchId = 'Batch ID',
  DeletedTimeStamp = 'Deleted timestamp',
  DeletionUserId = 'Deletion user ID',
  Status = 'Status',
}

export const BatchListTable = ({ batches }: Readonly<BatchListTableProps>) => {
  if (!batches.length) return null;

  return (
    <div data-testid="batch-list-table-container">
      <H4 style={{ fontSize: '20px' }}>Manage upload data</H4>
      <Table data-testid="batch-list-table">
        <Table.Row>
          {Object.values(BatchListTableHeaders).map((header) => (
            <Table.CellHeader key={header}>{header}</Table.CellHeader>
          ))}
          <Table.CellHeader></Table.CellHeader>
        </Table.Row>
        {batches.map((batch) => (
          <Table.Row key={batch.batchId}>
            <Table.Cell>{batch.originalFilename}</Table.Cell>
            <Table.Cell>{batch.createdAt.toISOString()}</Table.Cell>
            <Table.Cell>{batch.userId}</Table.Cell>
            <Table.Cell>{batch.publishedAt.toISOString()}</Table.Cell>
            <Table.Cell>{batch.indicatorId}</Table.Cell>
            <Table.Cell>{batch.batchId}</Table.Cell>
            <Table.Cell>{batch.deletedAt?.toISOString() ?? ''}</Table.Cell>
            <Table.Cell>{batch.deletedUserId ?? ''}</Table.Cell>
            <Table.Cell>{batch.status}</Table.Cell>
            <Table.Cell>
              <Button
                onClick={async () => {
                  await deleteBatch(batch.batchId);
                }}
              >
                Delete submission
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
};
