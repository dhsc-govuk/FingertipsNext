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

export class ApiClientFactory {
  private static areasApiInstance: AreasApi | null;
  private static indicatorsApiInstance: IndicatorsApi | null;
  private static systemApiInstance: SystemApi | null;
  private static userApiInstance: UserApi | null;
  private static batchesApiInstance: BatchesApi | null;

  public static getAreasApiClient(): AreasApi {
    if (!this.areasApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      this.areasApiInstance = new AreasApi(config);
    }

    return this.areasApiInstance;
  }

  public static async getAuthenticatedAreasApiClient(): Promise<AreasApi> {
    const apiUrl = readEnvVar('FINGERTIPS_API_URL');
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
      headers: await getAuthHeader(),
    });

    return new AreasApi(config);
  }

  public static getIndicatorsApiClient(): IndicatorsApi {
    if (!this.indicatorsApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      this.indicatorsApiInstance = new IndicatorsApi(config);
    }

    return this.indicatorsApiInstance;
  }

  public static async getAuthenticatedIndicatorsApiClient(): Promise<IndicatorsApi> {
    const apiUrl = readEnvVar('FINGERTIPS_API_URL');
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
      headers: await getAuthHeader(),
    });

    return new IndicatorsApi(config);
  }

  public static getSystemApiClient(): SystemApi {
    if (!this.systemApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      this.systemApiInstance = new SystemApi(config);
    }

    return this.systemApiInstance;
  }

  public static async getAuthenticatedSystemApiClient(): Promise<SystemApi> {
    const apiUrl = readEnvVar('FINGERTIPS_API_URL');
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
      headers: await getAuthHeader(),
    });

    return new SystemApi(config);
  }

  public static getUserApiClient(): UserApi {
    if (!this.userApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      this.userApiInstance = new UserApi(config);
    }

    return this.userApiInstance;
  }

  public static async getAuthenticatedUserApiClient(): Promise<UserApi> {
    const apiUrl = readEnvVar('FINGERTIPS_API_URL');
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
      headers: await getAuthHeader(),
    });

    return new UserApi(config);
  }

  public static getBatchesApiClient(): BatchesApi {
    if (!this.batchesApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
        fetchApi: fetch,
      });

      this.batchesApiInstance = new BatchesApi(config);
    }

    return this.batchesApiInstance;
  }

  public static async getAuthenticatedBatchesApiClient(): Promise<BatchesApi> {
    const apiUrl = readEnvVar('FINGERTIPS_API_URL');
    const config: Configuration = new Configuration({
      basePath: apiUrl,
      fetchApi: fetch,
      headers: await getAuthHeader(),
    });

    return new BatchesApi(config);
  }
}
