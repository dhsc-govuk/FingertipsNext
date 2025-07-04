'use client';

import { IndicatorUploadForm } from '@/upload/components/forms/IndicatorUploadForm';
import { useActionState } from 'react';
import { uploadFile } from '@/upload/components/forms/IndicatorUploadForm/uploadActions';
import { ApiResponsePanel } from '@/upload/components/organisms/ApiResponsePanel';
import {
  InterimWarning,
  InterimWarningText,
  PageHeading,
} from './Upload.styles';

export const Upload = () => {
  const [uploadResponse, uploadFileAction, uploadPending] = useActionState(
    uploadFile,
    undefined
  );

  return (
    <>
      <InterimWarning>
        <InterimWarningText>
          This is an interim tool to allow developers to demonstrate data upload
          to the API
        </InterimWarningText>
      </InterimWarning>

      {uploadResponse ? (
        <ApiResponsePanel apiResponse={uploadResponse} />
      ) : null}

      <PageHeading>Indicator data portal</PageHeading>

      <IndicatorUploadForm
        action={uploadFileAction}
        uploadPending={uploadPending}
      />
    </>
  );
};
