import { render } from '@testing-library/react';
import { SeedQueryCache } from '@/components/atoms/SeedQueryCache/SeedQueryCache';
import { useQueryClient } from '@tanstack/react-query';
import { SeedData } from '@/components/atoms/SeedQueryCache/seedQueryCache.types';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));
const setQueryDataMock = jest.fn();

beforeEach(() => {
  setQueryDataMock.mockClear();
  (useQueryClient as jest.Mock).mockReturnValue({
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
    jest.resetAllMocks();
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
