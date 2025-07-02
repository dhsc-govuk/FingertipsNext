'use server';

import { ResponseError } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export type UploadResponse = {
  status: number;
  body: string;
};

export async function uploadFile(
  _prevState: UploadResponse | undefined,
  formData: FormData
): Promise<UploadResponse> {
  // TODO: Handle not having a (numeric) indicator ID.
  const rawIndicatorId = formData.get('indicatorId');
  if (!rawIndicatorId) {
    throw Error('The indicator ID must be specified.');
  }
  const indicatorId = Number(formData.get('indicatorId'));

  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw Error('Bad file!'); // TODO: We're not handling these in the calling page!
  }

  // TODO: Convert the date into a suitable format.
  const publishDateDay = formData.get('publishDateDay');
  const publishDateMonth = formData.get('publishDateMonth');
  const publishDateYear = formData.get('publishDateYear');

  const indicatorApi = ApiClientFactory.getIndicatorsApiClient();

  try {
    const response = await indicatorApi.indicatorsIndicatorIdDataPostRaw({
      indicatorId,
      file,
    });

    return { status: response.raw.status, body: await response.raw.text() };
  } catch (error) {
    if (error instanceof ResponseError) {
      return {
        status: error.response.status,
        body: await error.response.text(),
      };
    }

    throw error;
  }
}
