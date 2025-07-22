import {
  AreasApi,
  BatchesApi,
  Configuration,
  IndicatorsApi,
  SystemApi,
  UserApi,
} from '@/generated-sources/ft-api-client';
import { readEnvVar } from '../envUtils';
import { getAuthHeader } from '@/lib/auth/accessToken';

export const API_CACHE_CONFIG = { next: { revalidate: 600 } };

const buildConfig = (): Configuration => {
  const apiUrl = readEnvVar('FINGERTIPS_API_URL');
  return new Configuration({
    basePath: apiUrl,
    fetchApi: fetch,
  });
};

const buildConfigWithAuthHeader = async (): Promise<Configuration> => {
  const apiUrl = readEnvVar('FINGERTIPS_API_URL');
  return new Configuration({
    basePath: apiUrl,
    fetchApi: fetch,
    headers: await getAuthHeader(),
  });
};

export class ApiClientFactory {
  private static areasApiInstance: AreasApi | null;
  private static indicatorsApiInstance: IndicatorsApi | null;
  private static systemApiInstance: SystemApi | null;
  private static userApiInstance: UserApi | null;
  private static batchesApiInstance: BatchesApi | null;

  public static getAreasApiClient(): AreasApi {
    if (!this.areasApiInstance) {
      this.areasApiInstance = new AreasApi(buildConfig());
    }

    return this.areasApiInstance;
  }

  public static getIndicatorsApiClient(): IndicatorsApi {
    if (!this.indicatorsApiInstance) {
      this.indicatorsApiInstance = new IndicatorsApi(buildConfig());
    }

    return this.indicatorsApiInstance;
  }

  public static async getAuthenticatedIndicatorsApiClient(): Promise<IndicatorsApi> {
    return new IndicatorsApi(await buildConfigWithAuthHeader());
  }

  public static getSystemApiClient(): SystemApi {
    if (!this.systemApiInstance) {
      this.systemApiInstance = new SystemApi(buildConfig());
    }

    return this.systemApiInstance;
  }

  public static getUserApiClient(): UserApi {
    if (!this.userApiInstance) {
      this.userApiInstance = new UserApi(buildConfig());
    }

    return this.userApiInstance;
  }

  public static getBatchesApiClient(): BatchesApi {
    if (!this.batchesApiInstance) {
      this.batchesApiInstance = new BatchesApi(buildConfig());
    }

    return this.batchesApiInstance;
  }

  public static async getAuthenticatedBatchesApiClient(): Promise<BatchesApi> {
    return new BatchesApi(await buildConfigWithAuthHeader());
  }
}
