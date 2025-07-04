import {
  IndicatorsApi,
  ResponseError,
} from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { mockDeep } from 'vitest-mock-extended';
import { uploadFile } from './uploadActions';

const mockIndicatorsApi = mockDeep<IndicatorsApi>();
ApiClientFactory.getIndicatorsApiClient = () => mockIndicatorsApi;

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

    await uploadFile(undefined, formData);

    expect(
      mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw
    ).toHaveBeenCalledWith({
      indicatorId: expectedIndicatorId,
      file: expectedFile,
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
});
