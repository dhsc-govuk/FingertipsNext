import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import {
  IIndicatorSearchService,
  IndicatorDocument,
} from '@/lib/search/searchTypes';
import { mockDeep } from 'vitest-mock-extended';
import IndicatorDefinitionPage from './page';
import { SearchParams } from '@/lib/searchStateManager';

const mockIndicatorSearchService = mockDeep<IIndicatorSearchService>();
SearchServiceFactory.getIndicatorSearchService = () =>
  mockIndicatorSearchService;

const mockGetIndicatorResponse: IndicatorDocument = {
  indicatorID: '500500',
  indicatorName: 'Miles Walked',
  indicatorDefinition: 'The number of miles The Proclaimers would walk',
  dataSource: 'The Proclaimers',
  earliestDataPeriod: '1988',
  latestDataPeriod: '1993',
  lastUpdatedDate: new Date('March 17, 2007'),
  hasInequalities: false,
  unitLabel: 'miles',
};

mockIndicatorSearchService.getIndicator.mockResolvedValue(
  mockGetIndicatorResponse
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Indicator definition page', () => {
  it('should call AI search single indicator endpoint with a given indicatorId', async () => {
    const expectedIndicatorId = '123456';

    await IndicatorDefinitionPage({
      params: Promise.resolve({ indicatorId: expectedIndicatorId }),
    });

    expect(mockIndicatorSearchService.getIndicator).toHaveBeenCalledWith(
      expectedIndicatorId
    );
  });

  it('should pass indicator definition props from ai search to the definition page', async () => {
    const page = await IndicatorDefinitionPage({
      params: Promise.resolve({
        indicatorId: mockGetIndicatorResponse.indicatorID,
      }),
    });

    expect(page.props.indicatorDefinitionProps).toMatchObject(
      mockGetIndicatorResponse
    );
  });

  it('should pass searchState prop using the params provided', async () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: ['1', '2'],
      [SearchParams.AreasSelected]: ['A001'],
    };

    const page = await IndicatorDefinitionPage({
      params: Promise.resolve({
        indicatorId: mockGetIndicatorResponse.indicatorID,
      }),
      searchParams: Promise.resolve(searchState),
    });

    expect(page.props.searchState).toMatchObject(searchState);
  });
});
