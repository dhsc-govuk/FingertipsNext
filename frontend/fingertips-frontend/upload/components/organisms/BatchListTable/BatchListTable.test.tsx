import { render, screen } from '@testing-library/react';
import { BatchListTable, BatchListTableHeaders } from '.';

describe('BatchListTable', () => {
  it('should render the expected elements', () => {
    render(<BatchListTable />);

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
  });
});
