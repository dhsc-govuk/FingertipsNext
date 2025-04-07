import { AreaSearchService } from './areaSearchService';
import { IndicatorSearchService } from './indicatorSearchService';
import { SearchServiceFactory } from './searchServiceFactory';
import EnvironmentVariables from '@/EnvironmentVariables';
import { mocked } from 'jest-mock';

jest.mock('./areaSearchService', () => {
  return {
    AreaSearchService: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('./indicatorSearchService', () => {
  return {
    IndicatorSearchService: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe('Search Service Factory', () => {
  let previousEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    previousEnv = process.env;

    process.env[EnvironmentVariables.DHSC_AI_SEARCH_SERVICE_URL] = 'someUrl';
    process.env[EnvironmentVariables.DHSC_AI_SEARCH_API_KEY] = 'someKey';
    process.env[EnvironmentVariables.AREA_SEARCH_INDEX_NAME] =
      'unittest-area-search-index-name';
    process.env[EnvironmentVariables.INDICATOR_SEARCH_INDEX_NAME] =
      'unittest-indicator-search-index-name';

    jest.clearAllMocks();
    SearchServiceFactory.reset();
  });

  afterEach(() => {
    process.env = { ...previousEnv };
  });

  it('should construct area search service with expected values', () => {
    SearchServiceFactory.getAreaSearchService();

    expect(mocked(AreaSearchService)).toHaveBeenCalledWith(
      'someUrl',
      'someKey',
      'unittest-area-search-index-name'
    );
  });

  it('should construct indicator search service with expected values', () => {
    SearchServiceFactory.getIndicatorSearchService();

    expect(mocked(IndicatorSearchService)).toHaveBeenCalledWith(
      'someUrl',
      'someKey',
      'unittest-indicator-search-index-name'
    );
  });
});
