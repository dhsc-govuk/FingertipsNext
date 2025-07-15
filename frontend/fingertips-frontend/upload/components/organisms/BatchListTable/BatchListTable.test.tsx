import { render, screen } from '@testing-library/react';
import { BatchListTable, BatchListTableHeaders } from '.';
import { mockBatch } from '@/mock/data/mockBatch';

describe('BatchListTable', () => {
  it('should render the expected elements', () => {
    const batchMock = mockBatch();
    render(<BatchListTable batches={[batchMock]} />);

    expect(
      screen.getByTestId('batch-list-table-container')
    ).toBeInTheDocument();
    expect(screen.getByTestId('batch-list-table')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Manage upload data'
    );
    expect(
      screen.getByRole('button', { name: 'Delete Submission' })
    ).toBeInTheDocument();
    Object.values(BatchListTableHeaders).forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    Object.values(batchMock).forEach((value) => {
      expect(screen.getByText(value.toString())).toBeInTheDocument();
    });
  });

  it('should not render the table if no batches are provided', () => {
    render(<BatchListTable batches={[]} />);

    expect(
      screen.queryByTestId('batch-list-table-container')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('batch-list-table')).not.toBeInTheDocument();
  });
});
