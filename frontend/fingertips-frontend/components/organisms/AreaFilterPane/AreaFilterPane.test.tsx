import { render, screen } from '@testing-library/react';
import { AreaFilterPane } from '.';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';

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

const mockSelectedAreasData = [
  mockAreaDataForNHSRegion['E40000007'],
  mockAreaDataForNHSRegion['E40000012'],
];

describe('Area Filter Pane', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Filters heading', () => {
    render(<AreaFilterPane />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should render the SelectedAreasPanel with the selected areas as pills', () => {
    render(<AreaFilterPane selectedAreasData={mockSelectedAreasData} />);

    expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });

  it('should render the SelectAreasFilterPanel', () => {
    render(<AreaFilterPane selectedAreasData={mockSelectedAreasData} />);

    expect(screen.getByTestId('select-areas-filter-panel')).toBeInTheDocument();
  });
});
