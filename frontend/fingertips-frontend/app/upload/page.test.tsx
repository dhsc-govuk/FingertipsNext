import UploadPage from './page';
import { mockDeep } from 'vitest-mock-extended';
import { BatchesApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockBatch } from '@/mock/data/mockBatch';

const mockBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getBatchesApiClient = () => mockBatchesApi;

vi.mock('@/lib/auth', () => {
  return {
    auth: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

describe('Upload page component', () => {
  it('should make an API call to fetch batches', async () => {
    mockBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    const uploadPage = await UploadPage();

    expect(mockBatchesApi.getBatches).toHaveBeenCalled();
    expect(uploadPage.props.batches).toEqual([mockBatch()]);
  });
});
