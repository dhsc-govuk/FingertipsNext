import {
  BatchesApi,
  IndicatorsApi,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { UTCDateMini } from '@date-fns/utc';
import { revalidatePath } from 'next/cache';
import { mockDeep } from 'vitest-mock-extended';
import { deleteBatch, uploadFile } from './uploadActions';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockAuthenticatedIndicatorsApi = mockDeep<IndicatorsApi>();
const mockAuthenticatedBatchesApi = mockDeep<BatchesApi>();
ApiClientFactory.getAuthenticatedBatchesApiClient = () =>
  Promise.resolve(mockAuthenticatedBatchesApi);
ApiClientFactory.getAuthenticatedIndicatorsApiClient = () =>
  Promise.resolve(mockAuthenticatedIndicatorsApi);

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
  mockAuthenticatedIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockResolvedValue(
    {
      raw: response,
      value: vi.fn(),
    }
  );
};

const givenTheDeleteApiReturns = ({
  status: expectedStatus,
  body: expectedBodyText,
}: {
  status: number;
  body: string;
}) => {
  const response = new Response(expectedBodyText, {
    status: expectedStatus,
  });
  mockAuthenticatedBatchesApi.batchesBatchIdDeleteRaw.mockResolvedValue({
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
  describe('uploadFile', () => {
    it('should pass the expected parameters to the API', async () => {
      const expectedIndicatorId = 4321;
      const expectedFile = new File([], 'indicator-data.csv');
      const formData = buildFormData({
        indicatorId: expectedIndicatorId,
        file: expectedFile,
      });

      await uploadFile(undefined, formData);

      expect(
        mockAuthenticatedIndicatorsApi.indicatorsIndicatorIdDataPostRaw
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
      mockAuthenticatedIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockRejectedValue(
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
      mockAuthenticatedIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockRejectedValue(
        error
      );
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
  });

  describe('deleteBatch', () => {
    it('should pass the batchId to the API', async () => {
      const batchId = '12345_2025-01-01T00:00:00.000';
      await deleteBatch(batchId);

      expect(
        mockAuthenticatedBatchesApi.batchesBatchIdDeleteRaw
      ).toHaveBeenCalledWith({
        batchId,
      });
      expect(revalidatePath).toHaveBeenCalledWith('/batches');
    });

    it('should return the expected message when the Batch Delete API call succeeds', async () => {
      const expectedStatus = 200;
      const expectedBodyText = 'Expected error text';
      givenTheDeleteApiReturns({
        status: expectedStatus,
        body: expectedBodyText,
      });

      const response = await deleteBatch('123');

      expect(response).toEqual({
        status: expectedStatus,
        message: expectedBodyText,
      });
    });

    it('should return the expected message when the Batch Delete API call returns an error', async () => {
      const expectedStatus = 400;
      const expectedBodyText = 'Expected error text';
      const rawResponse = new Response(expectedBodyText, {
        status: expectedStatus,
      });

      mockAuthenticatedBatchesApi.batchesBatchIdDeleteRaw.mockRejectedValue(
        new ResponseError(rawResponse)
      );
      const response = await deleteBatch('123');

      expect(response).toEqual({
        status: expectedStatus,
        message: expectedBodyText,
      });
    });

    it('should return the expected message if an unknown error occurs when calling the Batch Delete API', async () => {
      const error = new Error('Something totally unexpected happened!');
      mockAuthenticatedBatchesApi.batchesBatchIdDeleteRaw.mockRejectedValue(
        error
      );
      const response = await deleteBatch('123');

      expect(response).toEqual({
        message: `An error occurred when calling the API: Error: ${error.message}`,
      });
    });
  });
});
