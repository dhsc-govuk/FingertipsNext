import { convertHeatmapToCsv } from '@/components/organisms/Heatmap/convertHeatmapToCsv';
import { extractSortedAreasIndicatorsAndDataPoints } from '@/components/organisms/Heatmap/heatmapUtil';
import { CsvHeader } from '@/components/molecules/Export/export.types';

const mockAreas = [
  {
    code: 'E92000001',
    name: 'England',
  },
  {
    code: 'E12000002',
    name: 'North West Region',
  },
  {
    code: 'E06000008',
    name: 'Blackburn with Darwen',
  },
];

const mockIndicators = [
  {
    id: '41101',
    name: 'Emergency readmissions within 30 days of discharge from hospital',
    unitLabel: '%',
    latestDataPeriod: 2023,
    benchmarkMethod: 'CIOverlappingReferenceValue95',
    polarity: 'LowIsGood',
  },
];

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
    },
  },
};

const mockSortedData = {
  areas: mockAreas,
  indicators: mockIndicators,
  dataPoints: mockDataPoints,
} as ReturnType<typeof extractSortedAreasIndicatorsAndDataPoints>;

describe('convertHeatmapToCsv', () => {
  it('should have the correct headers', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockAreas[1].code,
      mockAreas[0].code
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
      mockAreas[1].code,
      mockAreas[0].code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicators[0].id as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[mockAreas[0].code as keyof typeof indicatorPoints];
    expect(result[3]).toEqual([
      mockIndicators[0].id,
      mockIndicators[0].name,
      mockIndicators[0].latestDataPeriod,
      mockAreas[0].name,
      mockAreas[0].code,
      undefined,
      undefined,
      mockIndicators[0].unitLabel,
      indicatorAreaPoint.value,
    ]);
  });

  it('should have the group row second to last', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockAreas[1].code,
      mockAreas[0].code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicators[0].id as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[mockAreas[1].code as keyof typeof indicatorPoints];
    const { value, benchmark } = indicatorAreaPoint;
    expect(result[2]).toEqual([
      mockIndicators[0].id,
      mockIndicators[0].name,
      mockIndicators[0].latestDataPeriod,
      `Group: ${mockAreas[1].name}`,
      mockAreas[1].code,
      benchmark.benchmarkAreaCode,
      benchmark.outcome,
      mockIndicators[0].unitLabel,
      value,
    ]);
  });

  it('should have the area row', () => {
    const result = convertHeatmapToCsv(
      mockSortedData,
      mockAreas[1].code,
      mockAreas[0].code
    );
    const indicatorPoints =
      mockDataPoints[mockIndicators[0].id as keyof typeof mockDataPoints];
    const indicatorAreaPoint =
      indicatorPoints[mockAreas[2].code as keyof typeof indicatorPoints];
    const { value, benchmark } = indicatorAreaPoint;
    expect(result[1]).toEqual([
      mockIndicators[0].id,
      mockIndicators[0].name,
      mockIndicators[0].latestDataPeriod,
      mockAreas[2].name,
      mockAreas[2].code,
      benchmark.benchmarkAreaCode,
      benchmark.outcome,
      mockIndicators[0].unitLabel,
      value,
    ]);
  });
});
