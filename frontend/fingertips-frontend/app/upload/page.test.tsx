import { mockAuth, mockSession } from '@/mock/utils/mockAuth';
import { BatchesApi } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockBatch } from '@/mock/data/mockBatch';
import { mockDeep } from 'vitest-mock-extended';
import UploadPage from './page';
import {
  NOT_SIGNED_IN_ERROR_MESSAGE,
  NOT_SIGNED_IN_ERROR_TITLE,
} from '@/lib/auth/errorMessages';

const mockAuthenticatedBatchesApi = mockDeep<BatchesApi>();

ApiClientFactory.getAuthenticatedBatchesApiClient = () =>
  Promise.resolve(mockAuthenticatedBatchesApi);

beforeEach(vi.clearAllMocks);

describe('Upload page component', () => {
  it('should make an API call to fetch batches', async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockAuthenticatedBatchesApi.getBatches.mockResolvedValue([mockBatch()]);

    const uploadPage = await UploadPage();

    expect(mockAuthenticatedBatchesApi.getBatches).toHaveBeenCalled();
    expect(uploadPage.props.batches).toEqual([mockBatch()]);
  });

  it('should not make a batches API call if user is not signed in', async () => {
    mockAuth.mockResolvedValue(null);

    const _ = await UploadPage();

    expect(mockAuthenticatedBatchesApi.getBatches).not.toHaveBeenCalled();
  });

  it('should populate error page with expected props if user is not signed in', async () => {
    mockAuth.mockResolvedValue(null);

    const uploadPage = await UploadPage();

    expect(uploadPage.props.title).toEqual(NOT_SIGNED_IN_ERROR_TITLE);
    expect(uploadPage.props.description).toEqual(NOT_SIGNED_IN_ERROR_MESSAGE);
  });
});
