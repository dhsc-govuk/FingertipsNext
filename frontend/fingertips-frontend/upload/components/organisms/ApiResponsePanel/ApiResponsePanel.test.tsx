import { ApiResponse } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { render, screen } from '@testing-library/react';
import { ApiResponsePanel } from '.';

describe('ApiResponsePanel', () => {
  it('should show the message', () => {
    const expectedMessage = 'Test message';
    const apiResponse: ApiResponse = { message: expectedMessage };

    render(<ApiResponsePanel apiResponse={apiResponse} />);

    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });

  it('should not show the status if it is not set', () => {
    const apiResponse: ApiResponse = { message: 'Test message' };

    render(<ApiResponsePanel apiResponse={apiResponse} />);

    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });

  it('should show the status if it is set', () => {
    const expectedStatus = 418;
    const apiResponse: ApiResponse = {
      message: 'Test message',
      status: expectedStatus,
    };

    render(<ApiResponsePanel apiResponse={apiResponse} />);

    expect(screen.getByText('HTTP status code')).toBeInTheDocument();
    expect(screen.getByText(expectedStatus)).toBeInTheDocument();
  });
});
