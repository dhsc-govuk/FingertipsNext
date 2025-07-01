'use server';

export type UploadResponse = {
  status: number;
  body: string;
};

export async function uploadFile(
  _prevState: UploadResponse | undefined,
  formData: FormData
): Promise<UploadResponse> {
  const indicatorId = formData.get('indicatorId');

  const file = formData.get('file');

  const publishDateDay = formData.get('publishDateDay');
  const publishDateMonth = formData.get('publishDateMonth');
  const publishDateYear = formData.get('publishDateYear');

  console.log('indicatorId:', indicatorId);
  console.dir(file);
  console.table({
    Day: publishDateDay,
    Month: publishDateMonth,
    Year: publishDateYear,
  });

  // TODO: Submit upload request
  const response = { status: 202, body: 'Accepted' };

  return Promise.resolve(response);
}
