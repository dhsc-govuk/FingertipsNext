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

  const rawPublishDateYear = formData.get('publishDateYear');
  if (!rawPublishDateYear) {
    return {
      message: 'The publish date year must be specified.',
    };
  }

  const rawPublishDateMonth = formData.get('publishDateMonth');
  if (!rawPublishDateMonth) {
    return {
      message: 'The publish date month must be specified.',
    };
  }

  const rawPublishDateDay = formData.get('publishDateDay');
  if (!rawPublishDateDay) {
    return {
      message: 'The publish date day must be specified.',
    };
  }

  const publishDateYear = Number(rawPublishDateYear);
  if (isNaN(publishDateYear)) {
    return {
      message: 'The publish date year must be a number.',
    };
  }

  const publishDateMonth = Number(rawPublishDateMonth);
  if (isNaN(publishDateMonth)) {
    return {
      message: 'The publish date month must be a number.',
    };
  }

  const publishDateDay = Number(rawPublishDateDay);
  if (isNaN(publishDateDay)) {
    return {
      message: 'The publish date day must be a number.',
    };
  }

  const isoPublishDate = formatISO(
    new UTCDateMini(publishDateYear, publishDateMonth - 1, publishDateDay)
  );
  // The ISO-8601 date string will be passed to the API when it is updated
  // to accept it.
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
