// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { BatchesApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockBatch } from '@/mock/data/mockBatch';
import { Session } from 'next-auth';
import { mockDeep } from 'vitest-mock-extended';
import UploadPage from './page';

const mockBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getBatchesApiClient = () => mockBatchesApi;

const expectedAccessToken = 'access-token';
const mockSession = mockDeep<Session>();
mockSession.accessToken = expectedAccessToken;
mockAuth.mockResolvedValue(mockSession);

describe('Upload page component', () => {
  it('should make an API call to fetch batches', async () => {
    mockBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    const uploadPage = await UploadPage();

    expect(mockBatchesApi.getBatches).toHaveBeenCalled();
    expect(uploadPage.props.batches).toEqual([mockBatch()]);
  });

  it('should include an authentication token with get batches API request', async () => {
    mockBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    await UploadPage();

    expect(mockBatchesApi.getBatches).toHaveBeenCalledWith({
      headers: { Authorization: `bearer ${expectedAccessToken}` },
    });
  });
});
