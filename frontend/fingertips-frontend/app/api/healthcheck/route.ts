import { NextResponse } from 'next/server';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export async function GET() {
  try {
    console.log('Healthcheck API triggered');

    const systemApi = ApiClientFactory.getSystemApiClient();
    const healthCheckResponse = await systemApi.getHealthcheck();

    console.log('Healthcheck API response:', healthCheckResponse);

    return NextResponse.json({ status: 'Healthy' }, { status: 200 });
  } catch (error) {
    console.error('Healthcheck API error:', error);
    return NextResponse.json(
      { status: 'Unhealthy', message: 'API call failed' },
      { status: 503 }
    );
  }
}
