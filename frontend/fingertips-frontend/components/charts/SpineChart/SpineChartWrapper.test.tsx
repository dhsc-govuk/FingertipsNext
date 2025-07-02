// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockUseSearchStateParams } from '@/mock/utils/mockUseSearchStateParams';
//
import { SpineChartWrapper } from '@/components/charts/SpineChart/SpineChartWrapper';
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
import { spineChartRequestParams } from '@/components/charts/SpineChart/helpers/spineChartRequestParams';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
} from '@/mock/data/mockHealthDataForArea';
import { screen } from '@testing-library/react';

const seedData: SeedData = {};
const searchState: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['41101', '22401'],
  [SearchParams.AreasSelected]: ['E12000004'],
  [SearchParams.AreaTypeSelected]: 'regions',
  [SearchParams.GroupTypeSelected]: 'england',
  [SearchParams.GroupSelected]: areaCodeForEngland,
};
mockUseSearchStateParams.mockReturnValue(searchState);

// mock the indicator meta data
const indicator41101 = mockIndicatorDocument({ indicatorID: '41101' });
const indicator22401 = mockIndicatorDocument({ indicatorID: '22401' });
seedData['/indicator/41101'] = indicator41101;
seedData['/indicator/41101'] = indicator22401;

// mock the quartiles
const quartilesParams = quartilesQueryParams(searchState);
const quartilesKey = queryKeyFromRequestParams(
  EndPoints.Quartiles,
  quartilesParams
);
seedData[quartilesKey] = [
  mockQuartileData({ indicatorId: 41101 }),
  mockQuartileData({ indicatorId: 22401 }),
];

// mock the health data
const reqParams = spineChartRequestParams(searchState);
const queryKeys = reqParams.map((params) =>
  queryKeyFromRequestParams(EndPoints.HealthDataForAnIndicator, params)
);
seedData[queryKeys[0]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 41101,
  areaHealthData: [mockHealthDataForArea({ areaCode: 'E12000004' })],
});
seedData[queryKeys[1]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 41101,
  areaHealthData: [mockHealthDataForArea_England()],
});
seedData[queryKeys[2]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 22401,
  areaHealthData: [mockHealthDataForArea({ areaCode: 'E12000004' })],
});
seedData[queryKeys[3]] = mockIndicatorWithHealthDataForArea({
  indicatorId: 22401,
  areaHealthData: [mockHealthDataForArea_England()],
});

describe('SpineChartWrapper', () => {
  it('renders the essential spine chart components', async () => {
    await testRenderQueryClient(<SpineChartWrapper />, seedData);

    expect(screen.getByTestId('spineChartTable-component')).toBeInTheDocument();
    expect(screen.getByTestId('benchmarkLegend-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('spineChartTable-export-button')
    ).toBeInTheDocument();
  });

  it('renders nothing if spineChartIndicatorData is undefined', async () => {
    const seedDataWithoutQuartiles = { ...seedData, [quartilesKey]: [] };
    const { htmlContainer } = await testRenderQueryClient(
      <SpineChartWrapper />,
      seedDataWithoutQuartiles
    );
    expect(htmlContainer?.firstChild).toBeNull();
  });
});
