import { GET } from './route';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { SystemApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'vitest-mock-extended';

vi.mock('@/lib/apiClient/apiClientFactory');

const mockSystemApi = mockDeep<SystemApi>();
const mockApiClientFactory = vi.mocked(ApiClientFactory);
mockApiClientFactory.getSystemApiClient.mockReturnValue(mockSystemApi);

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({
      json: async () => data,
      status: options.status,
    })),
  },
}));

describe('Healthcheck API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return 200 when API is healthy', async () => {
    mockSystemApi.getHealthcheck.mockResolvedValueOnce({ status: 'Healthy' });

    const response = await GET();
    const json = await response.json();

    expect(mockApiClientFactory.getSystemApiClient).toHaveBeenCalled();
    expect(mockSystemApi.getHealthcheck).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(json).toEqual({ status: 'Healthy' });
  });

  it('should return 503 with error message when API call fails', async () => {
    mockSystemApi.getHealthcheck.mockRejectedValueOnce(
      new Error('API failure')
    );

    const response = await GET();
    const json = await response.json();

    expect(mockApiClientFactory.getSystemApiClient).toHaveBeenCalled();
    expect(mockSystemApi.getHealthcheck).toHaveBeenCalled();
    expect(response.status).toBe(503);
    expect(json).toEqual({
      status: 'Unhealthy',
      message: 'API call failed',
    });
  });
});
