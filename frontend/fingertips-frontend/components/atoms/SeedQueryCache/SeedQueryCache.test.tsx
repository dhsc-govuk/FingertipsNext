import { render, screen } from '@testing-library/react';
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

  it('renders seeded URLs in development mode', () => {
    const seedData: SeedData = {
      '/api/test': mockIndicatorDocument(),
    };

    render(<SeedQueryCache seedData={seedData} />);
    expect(screen.getByText('Seeded these urls...')).toBeInTheDocument();
    expect(screen.getByText('/api/test')).toBeInTheDocument();
  });

  it('renders nothing if not in development mode', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NODE_ENV = 'production';

    const seedData: SeedData = {
      '/api/test': mockMeta,
    };

    const { container } = render(<SeedQueryCache seedData={seedData} />);
    expect(container.firstChild).toBeNull();
    expect(setQueryDataMock).toHaveBeenCalledWith(['/api/test'], mockMeta);
  });
});
