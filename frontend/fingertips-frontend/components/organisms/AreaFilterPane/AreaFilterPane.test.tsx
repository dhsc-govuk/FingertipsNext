import { render, screen } from '@testing-library/react';
import { AreaFilterPane } from '.';
import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateParams } from '@/lib/searchStateManager';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: vi.fn(),
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const mockSelectedAreasData = [
  mockAreaDataForNHSRegion['E40000007'],
  mockAreaDataForNHSRegion['E40000012'],
];

describe('Area Filter Pane', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Filters heading', () => {
    render(<AreaFilterPane />);

    expect(screen.getByRole('heading')).toHaveTextContent('Filters');
  });

  it('should not render the SelectedIndicatorsPanel when no selectedIndicatorsData is provided', () => {
    render(<AreaFilterPane />);

    expect(
      screen.queryByTestId('selected-indicators-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the SelectedIndicatorsPanel when selectedIndicatorsData is provided', () => {
    render(
      <AreaFilterPane
        selectedIndicatorsData={[generateIndicatorDocument('1')]}
      />
    );

    expect(screen.getByTestId('selected-indicators-panel')).toBeInTheDocument();
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
