import { Batch } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { getAuthHeader } from '@/lib/auth/accessToken';
import { Upload } from '@/upload/components/pages/upload';

export default async function UploadPage() {
  const batchApi = await ApiClientFactory.getAuthenticatedBatchesApiClient();

  let batches: Batch[] = [];
  try {
    batches = await batchApi.getBatches({
      headers: await getAuthHeader(),
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
  }

  return <Upload batches={batches} />;
}
