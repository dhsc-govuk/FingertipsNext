import { AreaSearchService } from './areaSearchService';
import { AreaSearchServiceMock } from './areaSearchServiceMock';
import { IndicatorSearchService } from './indicatorSearchService';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import { SearchServiceFactory } from './searchServiceFactory';

describe('Search Service Factory', () => {
  it('Should build mocks', () => {
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
    expect(SearchServiceFactory.getAreaSearchService()).toBeInstanceOf(
      AreaSearchServiceMock
    );
    expect(SearchServiceFactory.getIndicatorSearchService()).toBeInstanceOf(
      IndicatorSearchServiceMock
    );
  });
  it('Should build real instances', () => {
    process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = undefined;
    process.env.DHSC_AI_SEARCH_SERVICE_URL = 'someUrl';
    process.env.DHSC_AI_SEARCH_API_KEY = 'someKey';
    SearchServiceFactory.reset();
    expect(SearchServiceFactory.getAreaSearchService()).toBeInstanceOf(
      AreaSearchService
    );
    expect(SearchServiceFactory.getIndicatorSearchService()).toBeInstanceOf(
      IndicatorSearchService
    );
  });
});
