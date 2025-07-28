import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { withoutYears } from '@/lib/healthDataHelpers/withoutYears';

describe('withoutYears', () => {
  it('should set the deprecated year properties to 0', () => {
    const testData = mockIndicatorWithHealthDataForArea();

    const result = withoutYears(testData);

    const healthDataPoints = result.areaHealthData?.at(0)?.healthData ?? [];
    const hasAllZeroYears = healthDataPoints.every(({ year }) => year === 0);
    expect(hasAllZeroYears).toBe(true);
  });
});
