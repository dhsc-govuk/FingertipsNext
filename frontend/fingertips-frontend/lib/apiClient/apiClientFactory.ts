import {
  AreasApi,
  Configuration,
  IndicatorsApi,
  SystemApi,
} from '@/generated-sources/ft-api-client';
import { readEnvVar } from '../envUtils';

export class ApiClientFactory {
  private static areasApiInstance: AreasApi | null;
  private static indicatorsApiInstance: IndicatorsApi | null;
  private static systemApiInstance: SystemApi | null;

  public static getAreasApiClient(): AreasApi {
    if (!this.areasApiInstance) {
      const apiUrl = readEnvVar('FINGERTIPS_API_URL');
      const config: Configuration = new Configuration({
        basePath: apiUrl,
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
      });

      this.systemApiInstance = new SystemApi(config);
    }

    return this.systemApiInstance;
  }
}
