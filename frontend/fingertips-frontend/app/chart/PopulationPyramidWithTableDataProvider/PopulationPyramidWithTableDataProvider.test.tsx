import { PopulationPyramidWithTableDataProvider } from './index';
import { render } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';
import { mockDeep } from 'jest-mock-extended';
import { IIndicatorSearchService } from '@/lib/search/searchTypes';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import { Area } from '@/generated-sources/ft-api-client';

const mockGetHealthDataForAnIndicator = jest.fn();

const mockGetArea = jest.fn();

jest.mock('@/lib/apiClient/apiClientFactory', () => ({
  ApiClientFactory: {
    getAreasApiClient: jest.fn().mockImplementation(() => {
      return {
        getArea: mockGetArea,
      };
    }),
    getIndicatorsApiClient: jest.fn().mockImplementation(() => {
      return {
        getHealthDataForAnIndicator: mockGetHealthDataForAnIndicator,
      };
    }),
  },
}));

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

jest.mock('@/components/organisms/PopulationPyramidWithTable', () => ({
  PopulationPyramidWithTable: () => <div>PopulationPyramidWithTable</div>,
}));

describe('PopulationPyramidWithTableDataProvider', () => {
  beforeEach(() => {
    mockGetHealthDataForAnIndicator.mockClear();
    mockGetArea.mockClear();
    mockGetArea.mockResolvedValue({
      areaType: { hierarchyName: HierarchyNameTypes.NHS },
      code: 'E09000001',
      name: 'Test Area',
      parentArea: {
        code: 'E09000001',
        name: 'Test Area',
        areaType: { hierarchyName: HierarchyNameTypes.NHS },
      },
    });
    mockGetHealthDataForAnIndicator.mockClear();
    mockGetHealthDataForAnIndicator.mockResolvedValue({
      areaHealthData: [{ areaCode: 'E09000001', value: 100 }],
    });

    mockIndicatorSearchService.getIndicator.mockClear();
    mockIndicatorSearchService.getIndicator.mockResolvedValue({
      indicatorID: '',
      indicatorName: '',
      indicatorDefinition: '',
      dataSource: 'data source',
      earliestDataPeriod: '',
      latestDataPeriod: '',
      lastUpdatedDate: new Date(),
      hasInequalities: false,
      unitLabel: '',
    });
  });

  const searchParams = {
    [SearchParams.SearchedIndicator]: 'testing',
    [SearchParams.IndicatorsSelected]: ['333'],
    [SearchParams.AreasSelected]: ['001'],
  };

  it('renders PopulationPyramidWithTable with fetched data', async () => {
    const areaCodes = ['E09000001'];
    const jsxView = await PopulationPyramidWithTableDataProvider({
      areaCodes,
      searchState: searchParams,
    });
    const view = render(jsxView);
    expect(view).toBeTruthy();
    expect(view.getByText('PopulationPyramidWithTable')).toBeInTheDocument();
    expect(mockGetArea).toHaveBeenCalledTimes(2);
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledTimes(1);
    expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledTimes(1);
  });

  it('renders PopulationPyramidWithTable with more than 100 areas data to be fetched', async () => {
    const areas = ((n: number) => {
      //generate random area codes
      const results: Area[] = [];
      for (let i = 0; i < n; i++) {
        const randomNum = Math.floor(Math.random() * 100000);
        const paddedNum = String(randomNum).padStart(5, '0');
        const randomString = `E090${paddedNum}`;
        const area = {
          areaType: {
            hierarchyName: HierarchyNameTypes.NHS,
            key: '',
            name: 'NHS something',
            level: 0,
          },
          code: randomString,
          name: 'Test Area',
          parent: {
            key: '',
            level: 1,
            name: 'Test Area',
            areaType: { hierarchyName: HierarchyNameTypes.NHS },
          },
        };
        results.push(area);
      }
      return results;
    })(130);

    mockGetArea.mockImplementation(({ areaCode }: { areaCode: string }) => {
      const area = areas.find((area) => area.code === areaCode);
      if (!area) {
        // make sure we return an area if the code is not found.
        return areas[0];
      }
      return area;
    });

    const areaCodes = areas.map((area: Area) => {
      return area.code;
    });

    const jsxView = await PopulationPyramidWithTableDataProvider({
      areaCodes: [...areaCodes],
      searchState: searchParams,
    });
    const view = render(jsxView);
    expect(view).toBeTruthy();
    expect(view.getByText('PopulationPyramidWithTable')).toBeInTheDocument();
    expect(mockGetArea).toHaveBeenCalledTimes(131);
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledTimes(2);
    expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledTimes(1);
  });

  it('handles empty area codes', async () => {
    const jsxView = await PopulationPyramidWithTableDataProvider({
      areaCodes: [],
      searchState: searchParams,
    });
    const view = render(jsxView);
    expect(view).toBeTruthy();
    expect(view.getByText('PopulationPyramidWithTable')).toBeInTheDocument();
    expect(mockGetArea).not.toHaveBeenCalled();
    expect(mockGetHealthDataForAnIndicator).not.toHaveBeenCalled();
    expect(mockIndicatorSearchService.getIndicator).not.toHaveBeenCalled();
  });
});
