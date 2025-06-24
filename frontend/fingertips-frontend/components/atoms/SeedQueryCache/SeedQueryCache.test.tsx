import { render } from '@testing-library/react';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';
import { useQueryClient } from '@tanstack/react-query';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { Mock } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));
const setQueryDataMock = vi.fn();

beforeEach(() => {
  setQueryDataMock.mockClear();
  (useQueryClient as Mock).mockReturnValue({
    setQueryData: setQueryDataMock,
  });
});

const mockMeta = mockIndicatorDocument();
const mockHealth = mockIndicatorWithHealthDataForArea();

describe('SeedQueryCache', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetAllMocks();
  });

  it('calls setQueryData for each seeded entry', () => {
    const seedData: SeedData = {
      '/api/foo': mockMeta,
      '/api/bar': mockHealth,
    };

    render(<SeedQueryCache seedData={seedData} />);
    expect(setQueryDataMock).toHaveBeenCalledTimes(2);
    expect(setQueryDataMock).toHaveBeenCalledWith(['/api/foo'], mockMeta);
    expect(setQueryDataMock).toHaveBeenCalledWith(['/api/bar'], mockHealth);
  });
});
