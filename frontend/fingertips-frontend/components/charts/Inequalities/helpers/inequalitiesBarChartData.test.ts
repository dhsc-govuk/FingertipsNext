import { inequalitiesBarChartData } from '@/components/charts/Inequalities/helpers/inequalitiesBarChartData';
import { InequalitiesTableRowData } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

describe('inequalitiesBarChartData', () => {
  const mockHealthData: HealthDataForArea = {
    areaCode: 'E123',
    areaName: 'Test Area',
  } as HealthDataForArea;

  const mockAllData: InequalitiesTableRowData[] = [
    {
      period: '2020',
      value: 100,
      category: 'Male',
    },
    {
      period: '2021',
      value: 105,
      category: 'Female',
    },
  ] as unknown as InequalitiesTableRowData[];

  it('returns null if years array is empty', () => {
    const result = inequalitiesBarChartData(mockHealthData, mockAllData, []);
    expect(result).toBeNull();
  });

  it('returns null if no data matches selected year', () => {
    const result = inequalitiesBarChartData(
      mockHealthData,
      mockAllData,
      ['2020', '2021'],
      '2019'
    );
    expect(result).toBeNull();
  });

  it('returns data for the selected year if it exists', () => {
    const result = inequalitiesBarChartData(
      mockHealthData,
      mockAllData,
      ['2020', '2021'],
      '2020'
    );
    expect(result).toEqual({
      areaCode: 'E123',
      areaName: 'Test Area',
      data: mockAllData[0],
    });
  });

  it('falls back to the first year in years array when selectedYear is undefined', () => {
    const result = inequalitiesBarChartData(mockHealthData, mockAllData, [
      '2021',
      '2020',
    ]);
    expect(result).toEqual({
      areaCode: 'E123',
      areaName: 'Test Area',
      data: mockAllData[1],
    });
  });
});
