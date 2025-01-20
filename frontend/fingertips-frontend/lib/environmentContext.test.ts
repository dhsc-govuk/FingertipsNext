import {
  EnvironmentContext,
  DHSC_AI_SEARCH_SERVICE_URL,
  DHSC_AI_SEARCH_INDEX_NAME,
  DHSC_AI_SEARCH_API_KEY,
  DHSC_AI_SEARCH_USE_MOCK_SERVICE,
  DHSC_AI_SEARCH_SCORING_PROFILE,
} from './environmentContext';

describe('EnvironmentContext', () => {
  describe('if the environment is not configured it', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      delete process.env.DHSC_AI_SEARCH_SERVICE_URL;
      delete process.env.DHSC_AI_SEARCH_INDEX_NAME;
      delete process.env.DHSC_AI_SEARCH_API_KEY;
      delete process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE;
      delete process.env.DHSC_AI_SEARCH_SCORING_PROFILE;
      EnvironmentContext.reset();
    });

    it('should throw an error on attempting to load the environment context', () => {
      expect(() => {
        EnvironmentContext.getEnvironmentMap();
      }).toThrow(Error);
    });
  });

  describe('if the environment is fully configured it', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      process.env.DHSC_AI_SEARCH_SERVICE_URL = 'test-url';
      process.env.DHSC_AI_SEARCH_INDEX_NAME = 'test-index';
      process.env.DHSC_AI_SEARCH_API_KEY = 'test-api-key';
      process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'test-use-mock-service';
      process.env.DHSC_AI_SEARCH_SCORING_PROFILE = 'test-scoring-profile';
      EnvironmentContext.reset();
    });

    it('should load the complete set of supported environment variables', () => {
      const environment: Map<string, string> =
        EnvironmentContext.getEnvironmentMap();
      expect(environment.get(DHSC_AI_SEARCH_SERVICE_URL)).toBe('test-url');
      expect(environment.get(DHSC_AI_SEARCH_INDEX_NAME)).toBe('test-index');
      expect(environment.get(DHSC_AI_SEARCH_API_KEY)).toBe('test-api-key');
      expect(environment.get(DHSC_AI_SEARCH_USE_MOCK_SERVICE)).toBe(
        'test-use-mock-service'
      );
      expect(environment.get(DHSC_AI_SEARCH_SCORING_PROFILE)).toBe(
        'test-scoring-profile'
      );
    });
  });

  describe('if the environment is configured to use the mock search service it', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      delete process.env.DHSC_AI_SEARCH_SERVICE_URL;
      delete process.env.DHSC_AI_SEARCH_INDEX_NAME;
      delete process.env.DHSC_AI_SEARCH_API_KEY;
      process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
      delete process.env.DHSC_AI_SEARCH_SCORING_PROFILE;
      EnvironmentContext.reset();
    });

    it('should not require the other environment variables to be set', () => {
      const environment: Map<string, string> =
        EnvironmentContext.getEnvironmentMap();
      expect(environment.get(DHSC_AI_SEARCH_USE_MOCK_SERVICE)).toBe('true');
    });
  });
});
