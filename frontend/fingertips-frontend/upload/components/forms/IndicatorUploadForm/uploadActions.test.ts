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

const buildFormData = (
  indicatorId: number = 1234,
  file: File = new File([], 'upload.csv')
) => {
  const formData = new FormData();
  formData.set('indicatorId', String(indicatorId));
  formData.set('file', file);
  return formData;
};

describe('uploadActions', () => {
  it('should return the expected message if no indicator ID is provided', async () => {
    const response = await uploadFile(undefined, new FormData());

    expect(response).toEqual({
      message: 'The indicator ID must be specified.',
    });
  });

  it('should return the expected message if a non-numeric indicator ID is provided', async () => {
    const formData = new FormData();
    formData.set('indicatorId', 'Not a number!');

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      message: 'The indicator ID must be a number.',
    });
  });

  it('should return the expected message if an invalid file is provided', async () => {
    const formData = new FormData();
    formData.set('indicatorId', '1234');
    formData.set('file', '1234');

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      message: 'The provided file is not in the expected format.',
    });
  });

  it('should pass the expected parameters to the API', async () => {
    const expectedIndicatorId = 4321;
    const expectedFile = new File([], 'indicator-data.csv');
    const formData = buildFormData(expectedIndicatorId, expectedFile);

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
    const formData = buildFormData();

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
    const formData = buildFormData();

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      status: expectedStatus,
      message: expectedBodyText,
    });
  });

  it('should return the expected message if an unknown error occurs when calling the API', async () => {
    const error = new Error('Something totally unexpected happened!');
    mockIndicatorsApi.indicatorsIndicatorIdDataPostRaw.mockRejectedValue(error);
    const formData = buildFormData();

    const response = await uploadFile(undefined, formData);

    expect(response).toEqual({
      message: `An error occurred when calling the API: Error: ${error.message}`,
    });
  });
});
