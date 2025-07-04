import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockDeep } from 'vitest-mock-extended';
import { Upload } from '.';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const apiResponsePanelTestId = 'api-response-panel';

describe('Upload page component', () => {
  it('should render the warning text', () => {
    render(<Upload />);

    expect(
      screen.getByText(
        'This is an interim tool to allow developers to demonstrate data upload to the API'
      )
    ).toBeInTheDocument();
  });

  it('should not render the API response panel before the submit button has not been clicked', () => {
    render(<Upload />);

    expect(
      screen.queryByTestId(apiResponsePanelTestId)
    ).not.toBeInTheDocument();
  });

  it('should render the API response panel when the submit button has been clicked', async () => {
    mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockResolvedValue({
      raw: new Response('Body', {
        status: 202,
      }),
      value: vi.fn(),
    });
    const user = userEvent.setup();

    render(<Upload />);
    await user.click(screen.getByRole('button'));

    expect(
      await screen.findByTestId(apiResponsePanelTestId)
    ).toBeInTheDocument();
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
