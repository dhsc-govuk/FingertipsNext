import { ApiResponse } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { render, screen } from '@testing-library/react';
import { useActionState } from 'react';
import { Mock } from 'vitest';
import { Upload } from '.';

vi.mock('react', async () => {
  const originalModule = await vi.importActual('react');

  return {
    ...originalModule,
    useActionState: vi.fn(),
  };
});

function setupMockUseActionState<T>(state: T | undefined = undefined) {
  (useActionState as Mock).mockImplementation(
    (_: (formState: T, formData: FormData) => Promise<T>, _initialState: T) => [
      state,
      vi.fn(),
      false,
    ]
  );
}

describe('Upload page component', () => {
  beforeEach(() => {
    setupMockUseActionState<ApiResponse>();
  });

  it('should render the warning text', () => {
    render(<Upload />);

    expect(
      screen.getByText(
        'This is an interim tool to allow developers to demonstrate data upload to the API'
      )
    ).toBeInTheDocument();
  });

  it('should not render the API response panel when there is no response', () => {
    setupMockUseActionState<ApiResponse>(undefined);

    render(<Upload />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should render the API response panel when there a response', () => {
    setupMockUseActionState<ApiResponse>({ message: 'A message from the API' });
  });

  it('should render the page heading', () => {
    render(<Upload />);

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Indicator data portal'
    );
  });

  it('should render the upload form', () => {
    render(<Upload />);

    expect(screen.getByLabelText(/Add indicator ID/)).toBeInTheDocument();
  });
});
