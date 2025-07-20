import { Batch } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { auth } from '@/lib/auth';
import { Upload } from '@/upload/components/pages/upload';

export default async function UploadPage() {
  const batchApi = ApiClientFactory.getBatchesApiClient();

  let batches: Batch[] = [];
  try {
    const session = await auth();
    const accessToken = session?.accessToken;
    batches = await batchApi.getBatches({
      headers: { Authorization: `bearer ${accessToken}` },
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
  }

  return <Upload batches={batches} />;
}
