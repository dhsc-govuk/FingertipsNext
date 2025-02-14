import { GET } from './route';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { SystemApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';

jest.mock('@/lib/apiClient/apiClientFactory');

const mockSystemApi = mockDeep<SystemApi>();
const mockApiClientFactory = jest.mocked(ApiClientFactory);
mockApiClientFactory.getSystemApiClient.mockReturnValue(mockSystemApi);

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: async () => data,
      status: options.status,
    })),
  },
}));

describe('Healthcheck API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
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
