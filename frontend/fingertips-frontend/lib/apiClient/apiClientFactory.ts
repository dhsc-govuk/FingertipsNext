import {
  AreasApi,
  Configuration,
  IndicatorsApi,
  SystemApi,
} from '@/generated-sources/ft-api-client';
import { readEnvVar } from '../envUtils';

export const API_CACHE_CONFIG = { next: { revalidate: 0 } };

export class ApiClientFactory {
  private static areasApiInstance: AreasApi | null;
  private static indicatorsApiInstance: IndicatorsApi | null;
  private static systemApiInstance: SystemApi | null;

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
}
