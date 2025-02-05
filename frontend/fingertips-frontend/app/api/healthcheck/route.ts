import { NextResponse } from 'next/server';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export async function GET() {
  try {
    const systemApi = ApiClientFactory.getSystemApiClient();
    await systemApi.getHealthcheck();

    return NextResponse.json({ status: 'Healthy' }, { status: 200 });
  } catch {
    return NextResponse.json(
      { status: 'Unhealthy', message: 'API call failed' },
      { status: 503 }
    );
  }
}
