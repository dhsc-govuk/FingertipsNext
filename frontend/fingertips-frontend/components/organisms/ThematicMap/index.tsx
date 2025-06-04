'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useMemo } from 'react';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { BenchmarkLegend } from '../BenchmarkLegend';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client/models/IndicatorPolarity';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ThematicMapCredits } from '../../molecules/ThematicMapCredits';
import { ThematicMapTooltip } from '@/components/molecules/ThematicMapTooltip';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { useMapGeographyData } from '@/components/organisms/ThematicMap/useMapGeographyData';
import { H3 } from 'govuk-react';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  selectedAreaType?: string;
  areaCodes: string[];
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  benchmarkIndicatorData?: HealthDataForArea;
  comparatorData?: HealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
}

export function ThematicMap({
  healthIndicatorData,
  selectedAreaType,
  areaCodes,
  benchmarkComparisonMethod,
  polarity,
  benchmarkIndicatorData,
  comparatorData,
  indicatorMetadata,
}: Readonly<ThematicMapProps>) {
  const { isLoading, error, mapGeographyData } = useMapGeographyData(
    areaCodes,
    selectedAreaType as AreaTypeKeysForMapMeta
  );

  const chartOptions = useMemo(() => {
    if (!mapGeographyData || !selectedAreaType) return;
    return createThematicMapChartOptions(
      healthIndicatorData,
      mapGeographyData,
      selectedAreaType as AreaTypeKeysForMapMeta,
      benchmarkComparisonMethod,
      polarity
    );
  }, [
    benchmarkComparisonMethod,
    healthIndicatorData,
    mapGeographyData,
    polarity,
    selectedAreaType,
  ]);

  if (isLoading) {
    return <div style={{ marginBottom: '2rem' }}>Fetching map geometry...</div>;
  }

  if (error) {
    console.warn('error loading/processing map geometry', error);
    return null;
  }

  // This prevents errors from trying to render before the module is loaded in the useEffect callback
  if (!chartOptions) {
    return null;
  }

  return (
    <>
      <H3>Compare an indicator by areas</H3>
      <div
        id={'thematicMap'}
        data-testid="thematicMap-component"
        style={{
          border: `1px solid ${GovukColours.LightGrey}`,
          paddingInline: '5px',
        }}
      >
        {healthIndicatorData.map((indicatorDataForArea) => {
          return (
            <div
              key={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              id={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              style={{ display: 'none' }}
            >
              <ThematicMapTooltip
                indicatorData={indicatorDataForArea}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                measurementUnit={indicatorMetadata?.unitLabel}
                indicatorDataForBenchmark={benchmarkIndicatorData}
                indicatorDataForComparator={comparatorData}
                polarity={polarity}
              />
            </div>
          );
        })}
        <BenchmarkLegend
          title={`Compared to ${healthIndicatorData[0].healthData[0].benchmarkComparison?.benchmarkAreaName}`}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          polarity={polarity}
        />
        <HighChartsWrapper
          chartOptions={chartOptions}
          testId={'highcharts-react-thematicMap-component'}
          constructorType={'mapChart'}
        />
        <ThematicMapCredits
          areaType={selectedAreaType as AreaTypeKeysForMapMeta}
          dataSource={indicatorMetadata?.dataSource}
        />
      </div>
      <ExportOptionsButton
        targetId={'thematicMap'}
        chartOptions={chartOptions}
      />
    </>
  );
}
