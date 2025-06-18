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

  it('renders nothing when seedData is empty', () => {
    const { container } = render(<SeedQueryCache seedData={{}} />);
    expect(container.firstChild).toBeNull();
    expect(setQueryDataMock).not.toHaveBeenCalled();
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

  it('renders null', () => {
    const seedData: SeedData = {
      '/api/test': mockIndicatorDocument(),
    };

    const { container } = render(<SeedQueryCache seedData={seedData} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if not in development mode', () => {
    const seedData: SeedData = {
      '/api/production-mode': mockMeta,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NODE_ENV = 'production';
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<SeedQueryCache seedData={seedData} />);

    expect(setQueryDataMock).toHaveBeenCalledWith(
      ['/api/production-mode'],
      mockMeta
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('logs query keys in development mode', () => {
    const seedData: SeedData = {
      '/api/dev-mode': mockHealth,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NODE_ENV = 'development';
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<SeedQueryCache seedData={seedData} />);

    expect(setQueryDataMock).toHaveBeenCalledWith(
      ['/api/dev-mode'],
      mockHealth
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/dev-mode')
    );
  });
});
