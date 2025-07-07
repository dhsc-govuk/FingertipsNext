import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export const healthDataPointWithoutDeprecatedProps = (
  healthDataPoint: HealthDataPoint
): HealthDataPoint => ({
  ...healthDataPoint,
  sex: { value: 'deprecated', isAggregate: false },
});
