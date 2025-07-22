// MUST BE AT THE TOP DUE TO HOISTING OF MOCKED MODULES
import { mockAuth } from '@/mock/utils/mockAuth';
import {
  BatchesApi,
  IndicatorsApi,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { UTCDateMini } from '@date-fns/utc';
import { Session } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { mockDeep } from 'vitest-mock-extended';
import { deleteBatch, uploadFile } from './uploadActions';
import { getJWT } from '@/lib/auth/getJWT';
import { Mock } from 'vitest';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockSession = mockDeep<Session>();
mockAuth.mockResolvedValue(mockSession);

vi.mock('@/lib/auth/getJWT', () => {
  return { getJWT: vi.fn() };
});

const mockGetJWT = getJWT as Mock;

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
const mockBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;
ApiClientFactory.getBatchesApiClient = () => mockBatchesApi;
ApiClientFactory.getAuthenticatedIndicatorsApiClient = () =>
  Promise.resolve(mockIndicatorsApi);

const givenTheApiReturns = ({
  status: expectedStatus,
  body: expectedBodyText,
}: {
  status: number;
  body: string;
}) => {
  const response = new Response(expectedBodyText, {
    status: expectedStatus,
  });
  mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockResolvedValue({
    raw: response,
    value: vi.fn(),
  });
};

const buildFormData = ({
  indicatorId = 1234,
  file = new File([], 'upload.csv'),
  publishDateYear = 2017,
  publishDateMonth = 6,
  publishDateDay = 30,
}: {
  indicatorId?: number;
  file?: File;
  publishDateYear?: number;
  publishDateMonth?: number;
  publishDateDay?: number;
}) => {
  const formData = new FormData();

  formData.set('indicatorId', String(indicatorId));
  formData.set('file', file);
  formData.set('publishDateYear', String(publishDateYear));
  formData.set('publishDateMonth', String(publishDateMonth));
  formData.set('publishDateDay', String(publishDateDay));

  return formData;
};

describe('uploadActions', () => {
  it('should pass the expected parameters to the API', async () => {
    const expectedIndicatorId = 4321;
    const expectedFile = new File([], 'indicator-data.csv');
    const formData = buildFormData({
      indicatorId: expectedIndicatorId,
      file: expectedFile,
    });
    const expectedAccessToken = 'access-token';
    mockGetJWT.mockResolvedValue({ accessToken: expectedAccessToken });

    await uploadFile(undefined, formData);

    expect(
      mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw
    ).toHaveBeenCalledWith({
      indicatorId: expectedIndicatorId,
      file: expectedFile,
      publishedAt: new UTCDateMini(2017, 5, 30),
    });
  });

  it('should return the expected message when the API call succeeds', async () => {
    const expectedStatus = 202;
    const expectedBodyText = 'Expected body text';
    givenTheApiReturns({ status: expectedStatus, body: expectedBodyText });
    const formData = buildFormData({});

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      status: expectedStatus,
      message: expectedBodyText,
    });
  });

  it('should return the expected message if the API returns an error', async () => {
    const expectedStatus = 400;
    const expectedBodyText = 'Expected error text';
    const rawResponse = new Response(expectedBodyText, {
      status: expectedStatus,
    });
    mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockRejectedValue(
      new ResponseError(rawResponse)
    );
    const formData = buildFormData({});

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      status: expectedStatus,
      message: expectedBodyText,
    });
  });

  it('should return the expected message if an unknown error occurs when calling the API', async () => {
    const error = new Error('Something totally unexpected happened!');
    mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockRejectedValue(error);
    const formData = buildFormData({});

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      message: `An error occurred when calling the API: Error: ${error.message}`,
    });
  });

  it('should revalidate the batches API path after a successful upload', async () => {
    const expectedIndicatorId = 4321;
    const expectedFile = new File([], 'indicator-data.csv');
    const formData = buildFormData({
      indicatorId: expectedIndicatorId,
      file: expectedFile,
    });

    await uploadFile(undefined, formData);

    expect(revalidatePath).toHaveBeenCalledWith('/batches');
  });

  it('should pass the batchId to the API', async () => {
    const batchId = '12345_2025-01-01T00:00:00.000';
    await deleteBatch(batchId);

    expect(mockBatchesApi.batchesBatchIdDeleteRaw).toHaveBeenCalledWith({
      batchId,
    });
    expect(revalidatePath).toHaveBeenCalledWith('/batches');
  });
});
