import { ExportPreviewOptions } from '@/components/molecules/Export/ExportPreviewOptions';
import { render, screen } from '@testing-library/react';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';

describe('ExportPreviewOptions', () => {
  it('renders with the correct text', () => {
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ExportPreviewOptions targetId="test-id" />
      </QueryClientProvider>
    );

    const heading = screen.getByRole('group');
    expect(heading).toHaveTextContent('Export options');

    const hint = screen.getByText(/Select an export format/);
    expect(hint).toBeInTheDocument();

    const png = screen.getByLabelText('PNG');
    expect(png).toBeInTheDocument();
  });
});
