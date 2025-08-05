import { ErrorPage } from '@/components/pages/error';
import { Batch } from '@/generated-sources/ft-api-client';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { auth } from '@/lib/auth';
import {
  NOT_SIGNED_IN_ERROR_MESSAGE,
  NOT_SIGNED_IN_ERROR_TITLE,
} from '@/lib/auth/errorMessages';
import { Upload } from '@/upload/components/pages/upload';

export default async function UploadPage() {
  const session = await auth();
  if (!session) {
    return (
      <ErrorPage
        title={NOT_SIGNED_IN_ERROR_TITLE}
        description={NOT_SIGNED_IN_ERROR_MESSAGE}
      />
    );
  }

  const batchApi = await ApiClientFactory.getAuthenticatedBatchesApiClient();

  let batches: Batch[] = [];
  try {
    batches = await batchApi.getBatches();
  } catch (error) {
    console.error('Error fetching batches:', error);
  }

  return <Upload batches={batches} />;
}
