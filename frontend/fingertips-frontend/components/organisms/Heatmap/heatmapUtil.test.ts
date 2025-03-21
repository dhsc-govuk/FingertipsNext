import { expect } from '@jest/globals';
import { generateHeatmapData } from './heatmapUtil';
import { IndicatorRowData } from '@/components/organisms/Heatmap/index';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { noDeprivation } from '@/lib/mocks';

const areaCodes: Array<string> = ['a1', 'a2'];
const heatmapData: Array<IndicatorRowData> = [
  {
    indicator: 'Indicator1',
    year: 2023,
    rowData: [
      {
        areaCode: 'a1',
        areaName: 'area1',
        healthData: [
          {
            year: 2023,
            count: 3,
            value: 27,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            year: 2021,
            count: 3,
            value: 99,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'a2',
        areaName: 'area2',
        healthData: [
          {
            year: 1999,
            count: 3,
            value: 11,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            year: 2021,
            count: 16,
            value: 99,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'a3',
        areaName: 'area3',
        healthData: [
          {
            year: 2023,
            count: 3,
            value: 74,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ],
  },
  {
    indicator: 'Indicator2',
    year: 2021,
    rowData: [
      {
        areaCode: 'a1',
        areaName: 'area1',
        healthData: [
          {
            year: 2023,
            count: 3,
            value: 30,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            year: 2021,
            count: 3,
            value: 919,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
      {
        areaCode: 'a2',
        areaName: 'area2',
        healthData: [
          {
            year: 1999,
            count: 3,
            value: 11,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
          {
            year: 2021,
            count: 16,
            value: 53,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
            trend: HealthDataPointTrendEnum.NotYetCalculated,
            deprivation: noDeprivation,
          },
        ],
      },
    ],
  },
];

it('should generate the correct heatmap array from the provided data', () => {
  const result = generateHeatmapData(heatmapData, areaCodes);

  expect(result).toHaveLength(4);
  expect(result).toContainEqual({ x: 0, y: 0, value: 27 });
  expect(result).toContainEqual({ x: 1, y: 0, value: undefined });
  expect(result).toContainEqual({ x: 0, y: 1, value: 919 });
  expect(result).toContainEqual({ x: 1, y: 1, value: 53 });
});

it('should not return any results if either or both of the provided parameters is empty', () => {
  const resultNoIndicators = generateHeatmapData([], areaCodes);
  expect(resultNoIndicators).toHaveLength(0);

  const resultNoAreas = generateHeatmapData(heatmapData, []);
  expect(resultNoAreas).toHaveLength(0);

  const resultNoData = generateHeatmapData([], []);
  expect(resultNoData).toHaveLength(0);
});
