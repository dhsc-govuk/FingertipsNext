import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from '.';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import regionsMap from '@/components/organisms/ThematicMap/regions.json';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

const mockAreaCodes = ['E12000001', 'E12000002'];
const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

const testRender = () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => regionsMap,
  });

  const searchState: SearchStateParams = {
    [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    [SearchParams.AreaTypeSelected]: 'regions',
  };

  mockGetSearchState.mockReturnValue(searchState);
  render(
    <QueryClientProvider client={reactQueryClient}>
      <ThematicMap
        healthIndicatorData={mockHealthData['92420']}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        areaCodes={mockAreaCodes}
        selectedAreaType={'regions'}
        comparatorData={mockHealthData['92420'][0]}
      />
    </QueryClientProvider>
  );
};

describe('ThematicMap', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreaTypeSelected]: 'regions',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the loading message', async () => {
    testRender();
    const msg = screen.getByText('Fetching map geometry...');
    expect(msg).toBeInTheDocument();
  });

  it('should render the correct title', async () => {
    testRender();
    const title = await screen.findByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Compare an indicator by areas');
  });

  it('should render the correct benchmark title', async () => {
    testRender();
    const title = await screen.findByRole('heading', { level: 4 });
    expect(title).toHaveTextContent('Compared to England');
  });

  it('should render the benchmark legend', async () => {
    testRender();
    const legend = await screen.findByTestId('benchmarkLegend-component');
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Compared to England');
  });

  it('should render the credits', async () => {
    testRender();
    const credits = await screen.findByTestId('thematic-map-credits');
    expect(credits).toBeInTheDocument();
  });

  it('should render the hovers', async () => {
    testRender();
    const hovers = await screen.findAllByTestId('benchmark-tooltip-area');
    expect(hovers).toHaveLength(19); // 9 regions + 9 subregions + 1 England
  });

  it('should render the export button', async () => {
    testRender();
    const btn = await screen.findByRole('button', { name: 'Export options' });
    expect(btn).toBeInTheDocument();
  });
});
