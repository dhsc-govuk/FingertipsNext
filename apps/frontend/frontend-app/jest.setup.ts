import '@testing-library/jest-dom';
import 'jest-styled-components';

process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
process.env.FINGERTIPS_API_URL = 'ft-api-url/';

jest.mock('@/lib/logging', () => {
  const original = jest.requireActual('@/lib/logging');
  return {
    ...original,
    logUsingMockAiSearchService: jest.fn(),
  };
});

const windowMock = {
  scrollTo: jest.fn(),
};

Object.assign(global, windowMock);
