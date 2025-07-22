import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/react';

process.env.DHSC_AI_SEARCH_USE_MOCK_SERVICE = 'true';
process.env.FINGERTIPS_API_URL = 'ft-api-url/';

vi.mock('@/lib/logging', async () => {
  const original = await vi.importActual('@/lib/logging');
  return {
    ...original,
    logUsingMockAiSearchService: vi.fn(),
  };
});

const windowMock = {
  scrollTo: vi.fn(),
};

vi.mock('@/lib/auth/', () => {
  return {
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('@/lib/auth/getJWT', () => {
  return { getJWT: vi.fn() };
});

Object.assign(global, windowMock);

configure({
  asyncUtilTimeout: 5000,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'CSS', {
    value: {
      supports: vi.fn().mockImplementation(() => true),
    },
  });
}
