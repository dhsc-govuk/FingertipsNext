import { Upload } from '@/components/pages/upload';
import { connection } from 'next/server';

export default async function UploadPage() {
  await connection();

  return <Upload />;
}
