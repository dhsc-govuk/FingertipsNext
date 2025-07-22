// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { SingleIndicatorSpineChart } from '@/components/charts/SpineChart/SingleIndicatorSpineChart';
import { testRenderQueryClient } from '@/mock/utils/testRenderQueryClient';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { quartilesQueryParams } from '@/components/charts/SpineChart/helpers/quartilesQueryParams';
import {
  EndPoints,
  queryKeyFromRequestParams,
} from '@/components/charts/helpers/queryKeyFromRequestParams';
import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { screen } from '@testing-library/react';
import { oneIndicatorRequestParams } from '@/components/charts/helpers/oneIndicatorRequestParams';

const seedData: SeedData = {};
const searchState: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['41101'],
  [SearchParams.AreasSelected]: ['E12000004'],
  [SearchParams.AreaTypeSelected]: 'regions',
  [SearchParams.GroupTypeSelected]: 'england',
  [SearchParams.GroupSelected]: areaCodeForEngland,
};
mockUseSearchStateParams.mockReturnValue(searchState);

// mock the indicator meta data
const indicator41101 = mockIndicatorDocument({ indicatorID: '41101' });
seedData['/indicator/41101'] = indicator41101;

// mock the quartiles
const quartilesParams = quartilesQueryParams(searchState);
const quartilesKey = queryKeyFromRequestParams(
  EndPoints.Quartiles,
  quartilesParams
);
seedData[quartilesKey] = [mockQuartileData({ indicatorId: 41101 })];

// mock the health data
const reqParams = oneIndicatorRequestParams(searchState, []);
const queryKey = queryKeyFromRequestParams(
  EndPoints.HealthDataForAnIndicator,
  reqParams
);
seedData[queryKey] = mockIndicatorWithHealthDataForArea({
  indicatorId: 41101,
  areaHealthData: [
    mockHealthDataForArea({ areaCode: 'E12000004' }),
    mockHealthDataForArea_England(),
  ],
});

describe('SingleIndicatorSpineChart', () => {
  it('renders the essential spine chart components', async () => {
    await testRenderQueryClient(<SingleIndicatorSpineChart />, seedData);

    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
    expect(screen.getByTestId('benchmarkLegend-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('spineChartTable-export-button')
    ).toBeInTheDocument();
  });

  it('renders nothing if spineChartIndicatorData is undefined', async () => {
    const seedDataWithoutQuartiles = { ...seedData, [quartilesKey]: [] };
    const { htmlContainer } = await testRenderQueryClient(
      <SingleIndicatorSpineChart />,
      seedDataWithoutQuartiles
    );
    expect(htmlContainer?.firstChild).toBeNull();
  });
});
