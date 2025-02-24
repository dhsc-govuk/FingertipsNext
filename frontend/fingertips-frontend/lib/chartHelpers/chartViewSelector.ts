import { HealthDataForArea } from '@/generated-sources/ft-api-client';

export interface IChartViews {
  LineChart: boolean;
  popPyramid: boolean;
}
export function chartViewSelector(
  healthIndicatorData?: HealthDataForArea[]
): IChartViews {
  return { LineChart: true, popPyramid: false };
}
