import { convertHeatmapToCsv } from '@/components/charts/HeatMap/helpers/convertHeatmapToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { extractSortedAreasIndicatorsAndDataPoints } from './prepareHeatmapData';
import { Indicator } from '@/components/charts/HeatMap/heatmap.types';

const mockEngland = {
  code: 'E92000001',
  name: 'England',
};

const mockNorthWest = {
  code: 'E12000002',
  name: 'North West Region',
};

const mockBlackburnAndDarwen = {
  code: 'E06000008',
  name: 'Blackburn with Darwen',
};
const mockAreas = [mockEngland, mockNorthWest, mockBlackburnAndDarwen];

const mockIndicator: Indicator = {
  rowId: '41101',
  indicatorId: '41101',
  name: 'Emergency readmissions within 30 days of discharge from hospital',
  unitLabel: '%',
  latestDataPeriod: '2023',
  benchmarkMethod: 'CIOverlappingReferenceValue95',
  polarity: 'LowIsGood',
};

const mockDataPoints = {
  '41101': {
    E06000008: {
      value: 12.5,
      benchmark: {
        outcome: 'Better',
        benchmarkMethod: 'CIOverlappingReferenceValue95',
        polarity: 'LowIsGood',
        benchmarkAreaCode: 'E92000001',
      },
      areaCode: 'E06000008',
      indicatorId: '41101',
      rowId: '41101',
    },
    E92000001: {
      value: 14.8,
      benchmark: {
        outcome: 'Baseline',
        benchmarkMethod: 'CIOverlappingReferenceValue95',
        polarity: 'LowIsGood',
        benchmarkAreaCode: undefined,
      },
      areaCode: 'E92000001',
      indicatorId: '41101',
      rowId: '41101',
    },
    E12000002: {
      value: 14.2,
      benchmark: {
        outcome: 'Better',
        benchmarkMethod: 'CIOverlappingReferenceValue95',
        polarity: 'LowIsGood',
        benchmarkAreaCode: 'E92000001',
      },
      areaCode: 'E12000002',
      indicatorId: '41101',
      rowId: '41101',
    },
  },
};

const mockSortedData = {
  areas: mockAreas,
  indicators: [mockIndicator],
  dataPoints: mockDataPoints,
} as ReturnType<typeof extractSortedAreasIndicatorsAndDataPoints>;

describe('convertHeatmapToCsv', () => {
  it('should have the correct headers', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockNorthWest.code,
      mockEngland.code
    );
    expect(result[0]).toEqual([
      CsvHeader.IndicatorId,
      CsvHeader.IndicatorName,
      CsvHeader.Period,
      CsvHeader.Area,
      CsvHeader.AreaCode,
      CsvHeader.Benchmark,
      CsvHeader.BenchmarkComparison,
      CsvHeader.ValueUnit,
      CsvHeader.Value,
    ]);
  });

  it('should have the benchmark row', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockNorthWest.code,
      mockEngland.code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicator.rowId as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[mockEngland.code as keyof typeof indicatorPoints];
    expect(result[3]).toEqual([
      mockIndicator.rowId,
      mockIndicator.name,
      mockIndicator.latestDataPeriod,
      mockEngland.name,
      mockEngland.code,
      undefined,
      undefined,
      mockIndicator.unitLabel,
      indicatorAreaPoint.value,
    ]);
  });

  it('should have the group row second to last', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockNorthWest.code,
      mockEngland.code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicator.rowId as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[mockNorthWest.code as keyof typeof indicatorPoints];
    const { value, benchmark } = indicatorAreaPoint;
    expect(result[2]).toEqual([
      mockIndicator.rowId,
      mockIndicator.name,
      mockIndicator.latestDataPeriod,
      `Group: ${mockNorthWest.name}`,
      mockNorthWest.code,
      benchmark.benchmarkAreaCode,
      benchmark.outcome,
      mockIndicator.unitLabel,
      value,
    ]);
  });

  it('should have the area row', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockNorthWest.code,
      mockEngland.code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicator.rowId as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[
        mockBlackburnAndDarwen.code as keyof typeof indicatorPoints
      ];
    const { value, benchmark } = indicatorAreaPoint;
    expect(result[1]).toEqual([
      mockIndicator.rowId,
      mockIndicator.name,
      mockIndicator.latestDataPeriod,
      mockBlackburnAndDarwen.name,
      mockBlackburnAndDarwen.code,
      benchmark.benchmarkAreaCode,
      benchmark.outcome,
      mockIndicator.unitLabel,
      value,
    ]);
  });

  it('should put england at the end if the benchmark is also the group', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockNorthWest.code,
      mockNorthWest.code
    );
    expect(result[1][3]).toEqual(mockBlackburnAndDarwen.name);
    expect(result[2][3]).toEqual(`Group: ${mockNorthWest.name}`);
    expect(result[3][3]).toEqual(mockEngland.name);
  });
});
