import {
  AreasApi,
  Configuration,
  IndicatorsApi,
} from '@/generated-sources/ft-api-client';
import { readEnvVar } from '../envUtils';

export class ApiClientFactory {
  private static areasApiInstance: AreasApi | null;
  private static indicatorsApiInstance: IndicatorsApi | null;

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
}
