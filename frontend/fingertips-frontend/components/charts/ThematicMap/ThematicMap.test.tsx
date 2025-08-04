import { mockHighChartsWrapperSetup } from '@/mock/utils/mockHighChartsWrapper';
//
import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from './ThematicMap';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import regionsMap from '@/components/charts/ThematicMap/regions.json';
import { reactQueryClient } from '@/lib/reactQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { Mock } from 'vitest';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import {
  DatePeriod,
  Frequency,
  PeriodType,
} from '@/generated-sources/ft-api-client';

mockHighChartsWrapperSetup();

const mockAreaCodes = ['E12000001', 'E12000002'];
let mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const testRender = (name?: string) => {
  (fetch as Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => regionsMap,
  });

  const searchState: SearchStateParams = {
    [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
    [SearchParams.AreaTypeSelected]: 'regions',
  };

  mockSearchState = searchState;
  const mockDatePeriod: DatePeriod = {
    type: PeriodType.Financial,
    from: new Date('2008-01-01'),
    to: new Date('2008-12-31'),
  };
  render(
    <QueryClientProvider client={reactQueryClient}>
      <ThematicMap
        name={name}
        healthIndicatorData={mockHealthData['92420']}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        areaCodes={mockAreaCodes}
        selectedAreaType={'regions'}
        englandData={mockHealthData['92420'][0]}
        groupData={mockHealthData['92420'][1]}
        indicatorMetadata={mockIndicatorDocument({ indicatorID: '92420' })}
        periodType={PeriodType.Calendar}
        frequency={Frequency.Annually}
        latestDataPeriod={mockDatePeriod}
        isSmallestReportingPeriod={true}
      />
    </QueryClientProvider>
  );
};

describe('ThematicMap', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    mockSearchState = {
      [SearchParams.AreaTypeSelected]: 'regions',
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render the loading message', async () => {
    testRender();
    const msg = screen.getByText('Fetching map geometry...');
    expect(msg).toBeInTheDocument();
  });

  it('should render the correct title', async () => {
    testRender();
    const title = await screen.findByRole('heading', { level: 3 });
    expect(title).toHaveTextContent(
      chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title
    );
  });

  it('should render the correct chart title', async () => {
    testRender();
    const titles = await screen.findAllByRole('heading', { level: 4 });
    expect(titles[0]).toHaveTextContent(
      'Emergency readmissions within 30 days of discharge from hospital for Regions in North West, 2008'
    );
  });

  it('should render the correct benchmark legend when a different benchmark area is provided', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => regionsMap,
    });

    const searchState: SearchStateParams = {
      [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      [SearchParams.AreaTypeSelected]: 'regions',
    };

    mockSearchState = searchState;
    render(
      <QueryClientProvider client={reactQueryClient}>
        <ThematicMap
          healthIndicatorData={mockHealthData['92420']}
          benchmarkComparisonMethod={'Unknown'}
          englandData={mockHealthData['92420'][0]}
          polarity={'Unknown'}
          areaCodes={mockAreaCodes}
          selectedAreaType={'regions'}
          indicatorMetadata={mockIndicatorDocument({ indicatorID: '92420' })}
          periodType={PeriodType.Calendar}
          frequency={Frequency.Annually}
          isSmallestReportingPeriod={true}
        />
      </QueryClientProvider>
    );

    const legend = await screen.findByTestId('benchmarkLegend-component');
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Compared to Stub BenchmarkAreaName');
  });

  it('should render the benchmark legend', async () => {
    testRender();
    const legend = await screen.findByTestId('benchmarkLegend-component');
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Compared to Stub BenchmarkAreaName');
  });

  it('should render the credits', async () => {
    testRender();
    const credits = await screen.findByTestId('thematic-map-credits');
    expect(credits).toBeInTheDocument();
  });

  it('should render the hovers', async () => {
    testRender();
    const hovers = await screen.findAllByTestId('benchmark-tooltip-area');
    expect(hovers).toHaveLength(27); // 9 areas * 3 tooltip sections
  });

  it('should render the export button', async () => {
    testRender();
    const btn = await screen.findByRole('button', { name: 'Export options' });
    expect(btn).toBeInTheDocument();
  });

  it('should render the overridden chart title', async () => {
    testRender('Override');
    const titles = await screen.findAllByRole('heading', { level: 4 });
    expect(titles[0]).toHaveTextContent(
      'Override for Regions in North West, 2008/09'
    );
  });
});
