import { getEnvironmentVariable } from './utils';

export const DHSC_AI_SEARCH_USE_MOCK_SERVICE: string =
  'DHSC_AI_SEARCH_USE_MOCK_SERVICE';
export const DHSC_AI_SEARCH_SERVICE_URL: string = 'DHSC_AI_SEARCH_SERVICE_URL';
export const DHSC_AI_SEARCH_INDEX_NAME: string = 'DHSC_AI_SEARCH_INDEX_NAME';
export const DHSC_AI_SEARCH_API_KEY: string = 'DHSC_AI_SEARCH_API_KEY';
export const DHSC_AI_SEARCH_SCORING_PROFILE: string =
  'DHSC_AI_SEARCH_SCORING_PROFILE';

const loadEnvironmentContext = (): Map<string, string> => {
  console.log('Loading environment variables ...');
  const map: Map<string, string> = new Map();

  // Set required environment variables
  const mockService = getEnvironmentVariable(
    DHSC_AI_SEARCH_USE_MOCK_SERVICE
  ) as string;
  map.set(DHSC_AI_SEARCH_USE_MOCK_SERVICE, mockService);
  const useMock: boolean = mockService === 'true';

  // Following attributes are only mandatory if the mock search service is not being used.
  map.set(
    DHSC_AI_SEARCH_SERVICE_URL,
    getEnvironmentVariable(DHSC_AI_SEARCH_SERVICE_URL, !useMock) as string
  );
  map.set(
    DHSC_AI_SEARCH_INDEX_NAME,
    getEnvironmentVariable(DHSC_AI_SEARCH_INDEX_NAME, !useMock) as string
  );
  map.set(
    DHSC_AI_SEARCH_API_KEY,
    getEnvironmentVariable(DHSC_AI_SEARCH_API_KEY, !useMock) as string
  );

  // Set optional environment variables
  map.set(
    DHSC_AI_SEARCH_SCORING_PROFILE,
    getEnvironmentVariable(DHSC_AI_SEARCH_SCORING_PROFILE, false) as string
  );

  return map;
};

export const EnvironmentContext = (function () {
  let environmentMap: Map<string, string> | undefined;

  return {
    getEnvironmentMap: function () {
      if (!environmentMap) {
        environmentMap = loadEnvironmentContext();
      }
      return environmentMap;
    },
    reset: function () {
      environmentMap = undefined;
    },
  };
})();
