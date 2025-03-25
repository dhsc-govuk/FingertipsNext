import { render, screen } from '@testing-library/react';
import { SelectedIndicatorsPanel } from '.';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import userEvent from '@testing-library/user-event';
import { SearchParams } from '@/lib/searchStateManager';

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockSelectedIndicatorsData = [
  generateIndicatorDocument('1'),
  generateIndicatorDocument('2'),
];

describe('SelectedIndicatorsPanel', () => {
  it('snapshot test', () => {
    const container = render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should render the filter label', () => {
    render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
      />
    );

    expect(screen.getByText('Selected indicators (2)')).toBeInTheDocument();
  });

  it('should render the pill for each indicator', () => {
    render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
      />
    );

    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });

  it('should render a button to Add or change indicators', () => {
    render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
      />
    );

    expect(screen.getByRole('button')).toHaveTextContent(
      'Add or change indicators'
    );
  });

  it('should return to the results page with the provided search state when the Add or change button is clicked', async () => {
    const expectedPath = [
      `/results`,
      `?${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
      `&${SearchParams.AreasSelected}=E40000012`,
    ].join('');

    const user = userEvent.setup();

    render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
        searchState={{
          [SearchParams.IndicatorsSelected]: ['1', '2'],
          [SearchParams.AreasSelected]: ['E40000012'],
        }}
      />
    );

    await user.click(screen.getByRole('button'));

    expect(mockReplace).toHaveBeenCalledWith(expectedPath);
  });
});
