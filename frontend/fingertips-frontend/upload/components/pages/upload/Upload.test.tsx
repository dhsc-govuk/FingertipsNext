import { IndicatorsApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockDeep } from 'vitest-mock-extended';
import { Upload } from '.';
import { mockBatch } from '@/mock/data/mockBatch';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

const apiResponsePanelTestId = 'api-response-panel';

describe('Upload page component', () => {
  it('should render the warning text', () => {
    render(<Upload batches={[mockBatch()]} />);

    expect(
      screen.getByText(
        'This is an interim tool to allow developers to demonstrate data upload to the API'
      )
    ).toBeInTheDocument();
  });

  it('should not render the API response panel before the submit button has not been clicked', () => {
    render(<Upload batches={[mockBatch()]} />);

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

    render(<Upload batches={[mockBatch()]} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByTestId(apiResponsePanelTestId)
    ).toBeInTheDocument();
  });

  it('should render the page heading', () => {
    render(<Upload batches={[mockBatch()]} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Indicator data portal'
    );
  });

  it('should render the upload form', () => {
    render(<Upload batches={[mockBatch()]} />);

    expect(screen.getByLabelText(/Add indicator ID/)).toBeInTheDocument();
  });
});
