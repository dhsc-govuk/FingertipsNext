import { chartSymbols, generateSeriesData } from './generateSeriesData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { mockEnglandData, mockIndicatorData, mockParentData } from '../mocks';
import { chartColours } from '@/lib/chartHelpers/colours';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';

const area1WithIndicatorData = mockIndicatorData[0];
const area2WithIndicatorData = mockIndicatorData[1];
const twoAreasWithIndicatorData = [
  area1WithIndicatorData,
  area2WithIndicatorData,
];
const area1XCategoryKeys = area1WithIndicatorData.healthData.map((point) =>
  convertDateToNumber(point.datePeriod?.from)
);
const area2XCategoryKeys = area2WithIndicatorData.healthData.map((point) =>
  convertDateToNumber(point.datePeriod?.from)
);

const twoAreasXCategoryKeys = [...area1XCategoryKeys, ...area2XCategoryKeys];

describe('generateSeriesData', () => {
  it('should generate series for areas only', () => {
    const result = generateSeriesData(
      twoAreasXCategoryKeys,
      twoAreasWithIndicatorData
    );
    expect(result).toHaveLength(2);

    result.forEach((areaSeriesData, i) => {
      expect(areaSeriesData).toMatchObject({
        name: twoAreasWithIndicatorData[i].areaName,
        type: 'line',
        color: chartColours[i],
        marker: { symbol: chartSymbols[i] },
      });
    });
  });

  it('should generate series with confidence intervals', () => {
    const result = generateSeriesData(
      twoAreasXCategoryKeys,
      twoAreasWithIndicatorData,
      undefined,
      undefined,
      true
    );

    expect(result).toHaveLength(4); // 2 lines + 2 errorbars
    expect(result[1].type).toBe('errorbar');
    expect(result[3].type).toBe('errorbar');
  });

  it('should generate series with England as primary benchmark and group as additional benchmark', () => {
    const result = generateSeriesData(
      area1XCategoryKeys,
      [area1WithIndicatorData],
      mockEnglandData,
      mockParentData,
      false,
      areaCodeForEngland
    );

    expect(result[0]).toMatchObject({
      name: 'Benchmark: England',
      color: GovukColours.DarkGrey,
      marker: { symbol: 'circle' },
    });

    expect(result[1]).toMatchObject({
      name: `Group: ${mockParentData.areaName}`,
      color: GovukColours.Turquoise,
      marker: { symbol: 'diamond' },
    });
  });

  it('should generate series with group as primary benchmark and England as additional', () => {
    const result = generateSeriesData(
      area1XCategoryKeys,
      [area1WithIndicatorData],
      mockEnglandData,
      mockParentData,
      false,
      mockParentData.areaCode
    );

    expect(result[0]).toMatchObject({
      name: `Benchmark: ${mockParentData.areaName}`,
      color: GovukColours.DarkGrey,
      marker: { symbol: 'circle' },
    });

    expect(result[1]).toMatchObject({
      name: mockEnglandData.areaName,
      color: GovukColours.Pink,
      marker: { symbol: 'diamond' },
    });
  });

  it('should generate only England series with its confidenceIntervalSeries if areasData is empty and englandData is provided', () => {
    const result = generateSeriesData([], [], mockEnglandData);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: 'England',
      color: GovukColours.DarkGrey,
      marker: { symbol: 'circle' },
    });
    expect(result[1].type).toBe('errorbar');
  });
});
