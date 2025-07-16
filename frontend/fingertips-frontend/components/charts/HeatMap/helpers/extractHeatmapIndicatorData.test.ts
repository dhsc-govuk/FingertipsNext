import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { HeatmapIndicatorData } from '@/components/charts/HeatMap/heatmap.types';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { extractHeatmapIndicatorData } from '@/components/charts/HeatMap';

describe('extractHeatmapIndicatorData', () => {
  const populatedIndicatorData = mockIndicatorWithHealthDataForArea();
  const populatedIndicatorMetadata = mockIndicatorDocument();

  it('should populate heatmap indicator data with values from indicator data and metadata', () => {
    const expectedHeatmapIndicatorData: HeatmapIndicatorData = {
      rowId: `${populatedIndicatorMetadata.indicatorID}-sex:persons,age:,frequency:`,
      indicatorId: populatedIndicatorMetadata.indicatorID,
      indicatorName: `${populatedIndicatorMetadata.indicatorName} (persons)`,
      healthDataForAreas: populatedIndicatorData.areaHealthData ?? [],
      unitLabel: populatedIndicatorMetadata.unitLabel,
      benchmarkComparisonMethod:
        populatedIndicatorData.benchmarkMethod ??
        BenchmarkComparisonMethod.Unknown,
      polarity: populatedIndicatorData.polarity ?? IndicatorPolarity.Unknown,
      segmentInfo: { sex: 'persons', age: '', frequency: '' },
    };

    const heatmapData = extractHeatmapIndicatorData(
      populatedIndicatorData,
      populatedIndicatorMetadata,
      { sex: 'persons', age: '', frequency: '' }
    );

    expect(heatmapData).toEqual(expectedHeatmapIndicatorData);
  });

  it('should return undefined if indicatorData.areaHealthData is undefined', () => {
    const heatmapData = extractHeatmapIndicatorData(
      { ...populatedIndicatorData, areaHealthData: undefined },
      populatedIndicatorMetadata,
      { sex: 'persons', age: '', frequency: '' }
    );

    expect(heatmapData).toBe(undefined);
  });

  it('should default props if not defined in inputs', () => {
    const expectedHeatmapIndicatorData: HeatmapIndicatorData = {
      rowId: `${populatedIndicatorMetadata.indicatorID}-sex:persons,age:,frequency:`,
      indicatorId: populatedIndicatorMetadata.indicatorID,
      indicatorName: `${populatedIndicatorMetadata.indicatorName} (persons)`,
      healthDataForAreas: populatedIndicatorData.areaHealthData ?? [],
      unitLabel: populatedIndicatorMetadata.unitLabel,
      benchmarkComparisonMethod: BenchmarkComparisonMethod.Unknown,
      polarity: IndicatorPolarity.Unknown,
      segmentInfo: { sex: 'persons', age: '', frequency: '' },
    };

    const heatmapData = extractHeatmapIndicatorData(
      {
        ...populatedIndicatorData,
        benchmarkMethod: undefined,
        polarity: undefined,
      },
      populatedIndicatorMetadata,
      { sex: 'persons', age: '', frequency: '' }
    );

    expect(heatmapData).toEqual(expectedHeatmapIndicatorData);
  });
});
