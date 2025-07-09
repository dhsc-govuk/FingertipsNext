import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { generateRows } from './generateHeatmapRows';
import { generateHeaders } from './generateHeatmapHeaders';
import { HeaderType } from './heatmapTypes';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

describe('generate headers and rows - benchmark area is England', () => {
  const groupAreaCode = 'groupAreaCode';
  const sortedAreas = [
    { code: areaCodeForEngland, name: 'England' },
    { code: groupAreaCode, name: 'Group Area' },
    { code: 'generic code', name: 'Generic Area' },
  ];

  const sortedIndicators = [
    {
      id: '1',
      name: 'Indicator 1',
      unitLabel: 'per 100',
      latestDataPeriod: 1234,
      benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.HighIsGood,
    },
    {
      id: '2',
      name: 'Indicator 2',
      unitLabel: 'per 1,000',
      latestDataPeriod: 5678,
      benchmarkMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
      polarity: IndicatorPolarity.LowIsGood,
    },
  ];

  const missingDataPoint = {
    areaCode: sortedAreas[2].code,
    indicatorId: sortedIndicators[1].id,
  };

  interface DataPoint {
    value?: number;
    areaCode: string;
    indicatorId: string;
  }

  const dataPoints: Record<string, Record<string, DataPoint>> = {};
  sortedIndicators.forEach((indicator, indicatorIndex) => {
    dataPoints[indicator.id] = {};
    sortedAreas.forEach((area, areaIndex) => {
      if (
        !(
          indicator.id === missingDataPoint.indicatorId &&
          area.code === missingDataPoint.areaCode
        )
      ) {
        dataPoints[indicator.id][area.code] = {
          value: areaIndex + indicatorIndex * 10,
          indicatorId: indicator.id,
          areaCode: area.code,
        };
      }
    });
  });

  const headers = generateHeaders(
    sortedAreas,
    groupAreaCode,
    areaCodeForEngland
  );

  const rows = generateRows(
    sortedAreas,
    sortedIndicators,
    dataPoints,
    groupAreaCode,
    areaCodeForEngland
  );

  it('should set the first header to indicator title header', () => {
    expect(headers[0].type).toEqual(HeaderType.IndicatorTitle);
    expect(headers[0].content).toEqual('Indicators');
  });

  it('should set the second header to period header', () => {
    expect(headers[1].type).toEqual(HeaderType.Period);
    expect(headers[1].content).toEqual('Period');
  });

  it('should set the third header to value unit header', () => {
    expect(headers[2].type).toEqual(HeaderType.ValueUnit);
    expect(headers[2].content).toEqual('Value unit');
  });

  it('should set the header corresponding to the benchmark area (england) to benchmark header type', () => {
    expect(headers[3].type).toEqual(HeaderType.BenchmarkGroupArea);
    expect(headers[3].content).toEqual('Benchmark: England');
  });

  it('should set the header corresponding to the group area to group area header type', () => {
    expect(headers[4].type).toEqual(HeaderType.NonBenchmarkGroupArea);
    expect(headers[4].content).toEqual('Group: Group Area');
  });

  it('should set the header corresponding to an area to area header type', () => {
    expect(headers[5].type).toEqual(HeaderType.Area);
    expect(headers[5].content).toEqual('Generic Area');
  });

  it('should prefix each row with the correct indicator title', () => {
    expect(rows[0].cells[0].content).toEqual(sortedIndicators[0].name);
    expect(rows[1].cells[0].content).toEqual(sortedIndicators[1].name);
  });

  it('should prefix each row with the correct unit label', () => {
    expect(rows[0].cells[2].content).toEqual(sortedIndicators[0].unitLabel);
    expect(rows[1].cells[2].content).toEqual(sortedIndicators[1].unitLabel);
  });

  it('should prefix each row with the correct data period', () => {
    expect(rows[0].cells[1].content).toEqual(
      sortedIndicators[0].latestDataPeriod.toString()
    );
    expect(rows[1].cells[1].content).toEqual(
      sortedIndicators[1].latestDataPeriod.toString()
    );
  });

  it('should lay out data points in the correct order', () => {
    expect(rows[0].cells[3].content).toEqual('0.0');
    expect(rows[0].cells[4].content).toEqual('1.0');
    expect(rows[0].cells[5].content).toEqual('2.0');

    expect(rows[1].cells[3].content).toEqual('10.0');
    expect(rows[1].cells[4].content).toEqual('11.0');
    expect(rows[1].cells[5].content).toEqual('X');
  });

  it('should not populate hover properties on non-data cells', () => {
    expect(rows[0].cells[0].hoverProps).toBeUndefined();
    expect(rows[0].cells[1].hoverProps).toBeUndefined();
    expect(rows[0].cells[2].hoverProps).toBeUndefined();

    expect(rows[1].cells[0].hoverProps).toBeUndefined();
    expect(rows[1].cells[1].hoverProps).toBeUndefined();
    expect(rows[1].cells[2].hoverProps).toBeUndefined();
  });

  it('should populate hover properties on data cells', () => {
    expect(rows[0].cells[3].hoverProps).not.toBeUndefined();
    expect(rows[0].cells[4].hoverProps).not.toBeUndefined();
    expect(rows[0].cells[5].hoverProps).not.toBeUndefined();

    expect(rows[1].cells[3].hoverProps).not.toBeUndefined();
    expect(rows[1].cells[4].hoverProps).not.toBeUndefined();
    expect(rows[1].cells[5].hoverProps).not.toBeUndefined();
  });
});
