import { BatchesApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockBatch } from '@/mock/data/mockBatch';
import { mockDeep } from 'vitest-mock-extended';
import UploadPage from './page';

const mockAuthenticatedBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getAuthenticatedBatchesApiClient = () =>
  Promise.resolve(mockAuthenticatedBatchesApi);

describe('Upload page component', () => {
  it('should make an API call to fetch batches', async () => {
    mockAuthenticatedBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    const uploadPage = await UploadPage();

    expect(mockAuthenticatedBatchesApi.getBatches).toHaveBeenCalled();
    expect(uploadPage.props.batches).toEqual([mockBatch()]);
  });
});
