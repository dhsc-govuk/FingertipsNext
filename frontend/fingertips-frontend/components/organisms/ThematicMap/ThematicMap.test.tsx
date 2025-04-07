import { render, screen, waitFor } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from '.';
import { getMapGeographyData } from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';

const mockAreaType = 'regions';
const mockAreaCodes = ['E12000001', 'E12000002'];
const mockMapGeographyData = getMapGeographyData(mockAreaType, mockAreaCodes);
const mockMetaData = {
  indicatorID: '108',
  indicatorName: 'pancakes eaten',
  indicatorDefinition: 'number of pancakes consumed',
  dataSource: 'BJSS Leeds',
  earliestDataPeriod: '2025',
  latestDataPeriod: '2025',
  lastUpdatedDate: new Date('March 4, 2025'),
  unitLabel: 'pancakes',
  hasInequalities: true,
};

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

describe('ThematicMap', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreaTypeSelected]: 'regions',
    });
  });

  it('should render the benchmark legend', async () => {
    render(
      <ThematicMap
        healthIndicatorData={mockHealthData['92420']}
        mapGeographyData={await mockMapGeographyData}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        indicatorMetadata={mockMetaData}
      />
    );

    const actual = await screen.findByTestId('benchmarkLegend-component');
    expect(actual).toBeInTheDocument();
  });

  it('should display data source when metadata exists', async () => {
    render(
      <ThematicMap
        healthIndicatorData={mockHealthData['92420']}
        mapGeographyData={await mockMapGeographyData}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        indicatorMetadata={mockMetaData}
      />
    );

    const actual = await screen.findAllByText('Data source:', { exact: false });

    expect(actual[0]).toBeVisible();
  });

  // it('should not display data source when metadata does not exist', async () => {
  //   render(
  //     <ThematicMap
  //       healthIndicatorData={mockHealthData['92420']}
  //       mapGeographyData={await mockMapGeographyData}
  //       benchmarkComparisonMethod={'Unknown'}
  //       polarity={'Unknown'}
  //     />
  //   );
  //   // TODO: ASSERTION GIVING FALSE NEGATIVE
  //   expect(
  //     await waitFor(() => screen.findByText(/Data source: /))
  //   ).not.toBeVisible();
  // });

  it('should display maps source when it exists', async () => {
    render(
      <ThematicMap
        healthIndicatorData={mockHealthData['92420']}
        mapGeographyData={await mockMapGeographyData}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        indicatorMetadata={mockMetaData}
      />
    );

    const actual = await screen.findAllByText('Map source:', { exact: false });

    expect(actual[0]).toBeVisible();
  });
});
