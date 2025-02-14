import { NextResponse } from 'next/server';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';

export async function GET() {
  try {
    const systemApi = ApiClientFactory.getSystemApiClient();
    const healthCheckResponse = await systemApi.getHealthcheck();

    if (healthCheckResponse?.status === 'Healthy') {
      return NextResponse.json({ status: 'Healthy' }, { status: 200 });
    }
    return NextResponse.json(
      { status: 'Unhealthy', message: 'API did not report healthy status' },
      { status: 503 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Healthcheck API error:', error.stack);
    } else {
      console.error('Healthcheck API error:', error);
    }
    return NextResponse.json(
      { status: 'Unhealthy', message: 'API call failed' },
      { status: 503 }
    );
  }
}
