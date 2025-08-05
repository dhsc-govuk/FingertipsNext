import { render, screen } from '@testing-library/react';
import { BatchListTable, BatchListTableHeaders } from '.';
import { mockBatch } from '@/mock/data/mockBatch';
import userEvent from '@testing-library/user-event';
import { deleteBatch } from '../../forms/IndicatorUploadForm/uploadActions';

vi.mock('../../forms/IndicatorUploadForm/uploadActions');

describe('BatchListTable', () => {
  it('should render the expected elements', () => {
    const batchMock = mockBatch();

    render(
      <BatchListTable batches={[batchMock]} setDeleteResponse={vi.fn()} />
    );

    expect(
      screen.getByTestId('batch-list-table-container')
    ).toBeInTheDocument();
    expect(screen.getByTestId('batch-list-table')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Manage upload data'
    );
    expect(
      screen.getByRole('button', { name: 'Delete submission' })
    ).toBeInTheDocument();
    Object.values(BatchListTableHeaders).forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
    Object.values(batchMock).forEach((value) => {
      if (value instanceof Date)
        expect(screen.getByText(value.toISOString())).toBeInTheDocument();
      else expect(screen.getByText(value)).toBeInTheDocument();
    });
  });

  it('should not render the table if no batches are provided', () => {
    render(<BatchListTable batches={[]} setDeleteResponse={vi.fn()} />);

    expect(
      screen.queryByTestId('batch-list-table-container')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('batch-list-table')).not.toBeInTheDocument();
  });

  it('snapshot test', () => {
    const container = render(
      <BatchListTable batches={[mockBatch()]} setDeleteResponse={vi.fn()} />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('calls deleteBatch when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const functionMock = vi.fn();
    const batchMock = mockBatch();
    render(
      <BatchListTable batches={[batchMock]} setDeleteResponse={functionMock} />
    );

    await user.click(screen.getByRole('button'));

    expect(functionMock).toHaveBeenCalled();
    expect(deleteBatch).toHaveBeenCalledWith(batchMock.batchId);
  });
});
