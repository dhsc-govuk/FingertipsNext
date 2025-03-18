import { render, screen } from '@testing-library/react';
import { SelectedIndicatorsPanel } from '.';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';

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

    expect(screen.getByText('Selected indicators')).toBeInTheDocument();
  });

  it('should render the pill for each indicator', () => {
    render(
      <SelectedIndicatorsPanel
        selectedIndicatorsData={mockSelectedIndicatorsData}
      />
    );

    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });
});
