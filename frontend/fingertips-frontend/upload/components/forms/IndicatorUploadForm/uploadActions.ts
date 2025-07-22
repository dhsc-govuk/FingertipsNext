'use server';

import { ResponseError } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { UTCDateMini } from '@date-fns/utc';
import { revalidatePath } from 'next/cache';

export type ApiResponse = {
  status?: number;
  message: string;
};

const BATCHES_API_PATH = '/batches';

export async function uploadFile(
  _prevState: ApiResponse | undefined,
  formData: FormData
): Promise<ApiResponse> {
  const indicatorId = Number(formData.get('indicatorId'));
  const file = formData.get('file') as File;
  const publishDateYear = Number(formData.get('publishDateYear'));
  const publishDateMonth = Number(formData.get('publishDateMonth'));
  const publishDateDay = Number(formData.get('publishDateDay'));

  const publishedAt = new UTCDateMini(
    publishDateYear,
    publishDateMonth - 1,
    publishDateDay
  );

  const indicatorApi =
    await ApiClientFactory.getAuthenticatedIndicatorsApiClient();

  try {
    const response = await indicatorApi.indicatorsIndicatorIdDataPostRaw({
      indicatorId,
      file,
      publishedAt,
    });

    revalidatePath(BATCHES_API_PATH);

    return { status: response.raw.status, message: await response.raw.text() };
  } catch (error) {
    return await returnResponseError(error);
  }
}

export async function deleteBatch(batchId: string): Promise<ApiResponse> {
  const batchesApi = ApiClientFactory.getBatchesApiClient();

  try {
    const response = await batchesApi.batchesBatchIdDeleteRaw({ batchId });

    revalidatePath(BATCHES_API_PATH);

    return { status: response.raw.status, message: await response.raw.text() };
  } catch (error) {
    return await returnResponseError(error);
  }
}

async function returnResponseError(error: unknown): Promise<ApiResponse> {
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
