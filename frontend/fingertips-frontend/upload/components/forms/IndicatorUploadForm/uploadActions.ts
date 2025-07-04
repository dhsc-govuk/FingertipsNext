'use server';

import { ResponseError } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { UTCDateMini } from '@date-fns/utc';
import { formatISO } from 'date-fns';

export type ApiResponse = {
  status?: number;
  message: string;
};

export async function uploadFile(
  _prevState: ApiResponse | undefined,
  formData: FormData
): Promise<ApiResponse> {
  const indicatorId = Number(formData.get('indicatorId'));
  const file = formData.get('file') as File;
  const publishDateYear = Number(formData.get('publishDateYear'));
  const publishDateMonth = Number(formData.get('publishDateMonth'));
  const publishDateDay = Number(formData.get('publishDateDay'));

  const isoPublishDate = formatISO(
    new UTCDateMini(publishDateYear, publishDateMonth - 1, publishDateDay)
  );
  // The ISO-8601 date string will be passed to the API when it has been
  // updated to accept it.
  console.log('Publish date: ', isoPublishDate);

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
