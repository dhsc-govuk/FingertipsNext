import { mockHealthData } from '@/mock/data/healthdata';
import { chartViewSelector } from './chartViewSelector';

describe('chartViews', () => {
  it('should return and object with {"LineChart": true} if serachParams are for one indicator and one area, and healthIndicatorData which has data for more than one year', () => {});
  expect(chartViewSelector(mockHealthData[318]).LineChart).toBeTruthy;
});
