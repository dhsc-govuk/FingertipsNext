import { PopulationPyramidWithTableDataProvider } from './index';
import { render } from '@testing-library/react';
import { SearchParams } from '@/lib/searchStateManager';
import { HierarchyNameTypes } from '@/lib/areaFilterHelpers/areaType';
import { GetHealthDataForAnIndicatorInequalitiesEnum } from '@/generated-sources/ft-api-client';

const mockGetHealthDataForAnIndicator = jest.fn();

const mockGetArea = jest.fn().mockResolvedValue({
  areaType: { hierarchyName: HierarchyNameTypes.NHS },
});

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

jest.mock('@/components/organisms/PopulationPyramidWithTable', () => ({
  PopulationPyramidWithTable: () => <div>PopulationPyramidWithTable</div>,
}));

describe('PopulationPyramidWithTableDataProvider', () => {
  beforeEach(() => {
    mockGetHealthDataForAnIndicator.mockClear();
    mockGetArea.mockClear();
    mockGetArea.mockResolvedValue({
      areaType: { hierarchyName: HierarchyNameTypes.NHS },
      areaCode: 'E09000001',
      areaName: 'Test Area',
      parentArea: {
        areaCode: 'E09000001',
        areaName: 'Test Area',
        areaType: { hierarchyName: HierarchyNameTypes.NHS },
      },
    });
    mockGetHealthDataForAnIndicator.mockClear();
    mockGetHealthDataForAnIndicator.mockResolvedValue({
      areaHealthData: [{ areaCode: 'E09000001', value: 100 }],
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
    expect(mockGetArea).toHaveBeenCalledTimes(1);
    expect(mockGetHealthDataForAnIndicator).toHaveBeenCalledTimes(1);
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
  });
});
