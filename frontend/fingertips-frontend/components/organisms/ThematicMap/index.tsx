'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useMemo } from 'react';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
  thematicMapTitle,
} from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { BenchmarkLegend } from '../BenchmarkLegend';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client/models/IndicatorPolarity';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ThematicMapCredits } from '../../molecules/ThematicMapCredits';
import { ThematicMapTooltip } from '@/components/molecules/ThematicMapTooltip';
import { useMapGeographyData } from '@/components/organisms/ThematicMap/useMapGeographyData';
import { H3 } from 'govuk-react';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';

interface ThematicMapProps {
  healthIndicatorData: HealthDataForArea[];
  selectedAreaType?: string;
  areaCodes: string[];
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  englandData?: HealthDataForArea;
  groupData?: HealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
  benchmarkToUse?: string;
}

export function ThematicMap({
  healthIndicatorData,
  selectedAreaType,
  areaCodes,
  benchmarkComparisonMethod,
  polarity,
  englandData,
  groupData,
  indicatorMetadata,
  benchmarkToUse,
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
  if (!chartOptions || !selectedAreaType || !indicatorMetadata) {
    console.log({ chartOptions, selectedAreaType, indicatorMetadata });
    return null;
  }

  const title = thematicMapTitle(
    indicatorMetadata,
    selectedAreaType,
    groupData,
    healthIndicatorData
  );

  return (
    <>
      <H3>Compare an indicator by areas</H3>
      <ContainerWithOutline>
        <div id={'thematicMap'} data-testid="thematicMap-component">
          <ChartTitle>{title}</ChartTitle>
          {healthIndicatorData.map((indicatorDataForArea) => (
            <div
              key={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              id={`thematicMap-chart-hover-${indicatorDataForArea.areaCode}`}
              style={{ display: 'none' }}
            >
              <ThematicMapTooltip
                indicatorData={indicatorDataForArea}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                measurementUnit={indicatorMetadata?.unitLabel}
                englandData={englandData}
                groupData={groupData}
                polarity={polarity}
                benchmarkToUse={benchmarkToUse}
              />
            </div>
          ))}
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
          <ExportOnlyWrapper>
            <ExportCopyright />
          </ExportOnlyWrapper>
          <ThematicMapCredits
            areaType={selectedAreaType as AreaTypeKeysForMapMeta}
            dataSource={indicatorMetadata?.dataSource}
          />
        </div>
      </ContainerWithOutline>
      <ExportOptionsButton
        targetId={'thematicMap'}
        chartOptions={{
          ...chartOptions,
          custom: { mapAreaType: selectedAreaType as AreaTypeKeysForMapMeta },
        }}
      />
    </>
  );
}
