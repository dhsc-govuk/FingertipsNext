'use client';

import { IndicatorUploadForm } from '@/upload/components/forms/IndicatorUploadForm';
import { useActionState, useState } from 'react';
import {
  ApiResponse,
  uploadFile,
} from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { ApiResponsePanel } from '@/upload/components/organisms/ApiResponsePanel';
import {
  InterimWarning,
  InterimWarningText,
  PageHeading,
} from './Upload.styles';
import { BatchListTable } from '../../organisms/BatchListTable';
import { Batch } from '@/generated-sources/ft-api-client';

type UploadProps = {
  batches: Batch[];
};

export const Upload = ({ batches }: Readonly<UploadProps>) => {
  const [deleteResponse, setDeleteResponse] = useState(
    null as unknown as ApiResponse
  );
  const [uploadResponse, uploadFileAction, uploadPending] = useActionState(
    uploadFile,
    undefined
  );

  const response = uploadResponse ?? deleteResponse;

  return (
    <>
      <InterimWarning>
        <InterimWarningText>
          This is an interim tool to allow developers to demonstrate data upload
          to the API
        </InterimWarningText>
      </InterimWarning>

      {response ? <ApiResponsePanel apiResponse={response} /> : null}

      <PageHeading>Indicator data portal</PageHeading>

      <IndicatorUploadForm
        action={uploadFileAction}
        uploadPending={uploadPending}
      />

      <BatchListTable batches={batches} deletionState={setDeleteResponse} />
    </>
  );
};
