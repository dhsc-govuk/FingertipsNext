'use server';

import { ResponseError } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export type ApiResponse = {
  status?: number;
  message: string;
};

export async function uploadFile(
  _prevState: ApiResponse | undefined,
  formData: FormData
): Promise<ApiResponse> {
  const rawIndicatorId = formData.get('indicatorId');
  if (!rawIndicatorId) {
    return {
      message: 'The indicator ID must be specified.',
    };
  }
  const indicatorId = Number(formData.get('indicatorId'));
  if (isNaN(indicatorId)) {
    return {
      message: 'The indicator ID must be a number.',
    };
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return { message: 'The provided file is not in the expected format.' };
  }

  // TODO: Convert the date into a suitable format.
  // const publishDateDay = formData.get('publishDateDay');
  // const publishDateMonth = formData.get('publishDateMonth');
  // const publishDateYear = formData.get('publishDateYear');

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  try {
    const response = await indicatorApi.indicatorsIndicatorIdDataPostRaw({
      indicatorId,
      file,
    });

    return { status: response.raw.status, message: await response.raw.text() };
  } catch (error) {
    if (error instanceof ResponseError) {
      return {
        status: error.response.status,
        message: await error.response.text(),
      };
    }

    return {
      message: `An error occurred when calling the API: ${error}`,
    };
  }
}
