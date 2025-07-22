// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import { BatchesApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockBatch } from '@/mock/data/mockBatch';
import { Session } from 'next-auth';
import { mockDeep } from 'vitest-mock-extended';
import UploadPage from './page';
import { getJWT } from '@/lib/auth/getJWT';

vi.mock('@/lib/auth/getJWT', () => {
  return { getJWT: vi.fn() };
});

const mockAuthenticatedBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getAuthenticatedBatchesApiClient = () =>
  Promise.resolve(mockAuthenticatedBatchesApi);

const expectedAccessToken = 'access-token';
const mockSession = mockDeep<Session>();
mockAuth.mockResolvedValue(mockSession);
vi.mocked(getJWT).mockResolvedValue({ accessToken: expectedAccessToken });

describe('Upload page component', () => {
  it('should make an API call to fetch batches', async () => {
    mockAuthenticatedBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    const uploadPage = await UploadPage();

    expect(mockAuthenticatedBatchesApi.getBatches).toHaveBeenCalled();
    expect(uploadPage.props.batches).toEqual([mockBatch()]);
  });
});
