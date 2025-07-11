import { Batch } from '@/generated-sources/ft-api-client';
import { Table, Button, H4 } from 'govuk-react';
import React from 'react';
import {
  StyledButtonTableCell,
  StyledTable,
  StyledTableCell,
  StyledTableCellHeader,
} from './BatchListTable.styles';
import { mockBatch } from '@/mock/data/mockBatch';

// type BatchListTableProps = {
//   batches: Batch[];
// };

const batches: Batch[] = [mockBatch()];

export enum BatchListTableHeaders {
  OriginalFilename = 'Original filename',
  Timestamp = 'Timestamp',
  UserId = 'User ID',
  PublishDate = 'Publish date',
  IndicatorId = 'Indicator ID',
  BatchId = 'Batch ID',
  Status = 'Status',
}

export const BatchListTable = () => {
  return batches.length ? (
    <div data-testid="batch-list-table-container">
      <H4>Manage upload data</H4>
      <StyledTable data-testid="batch-list-table">
        <Table.Row>
          {Object.values(BatchListTableHeaders).map((header) => (
            <StyledTableCellHeader key={header}>{header}</StyledTableCellHeader>
          ))}
          <StyledTableCellHeader></StyledTableCellHeader>
        </Table.Row>
        {batches.map((batch, index) => (
          <Table.Row key={batch.batchId + index}>
            <StyledTableCell>{batch.originalFilename}</StyledTableCell>
            <StyledTableCell>{batch.createdAt.toString()}</StyledTableCell>
            <StyledTableCell>{batch.userId}</StyledTableCell>
            <StyledTableCell>{batch.publishedAt.toString()}</StyledTableCell>
            <StyledTableCell>{batch.indicatorId}</StyledTableCell>
            <StyledTableCell>{batch.batchId}</StyledTableCell>
            <StyledTableCell>{batch.status}</StyledTableCell>
            <StyledButtonTableCell>
              <Button>Delete Submission</Button>
            </StyledButtonTableCell>
          </Table.Row>
        ))}
      </StyledTable>
    </div>
  ) : null;
};
