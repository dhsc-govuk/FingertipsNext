'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client/models/HealthDataForArea';
import { useMemo } from 'react';
import {
  AreaTypeKeysForMapMeta,
  createThematicMapChartOptions,
  thematicMapTitle,
} from '@/components/charts/ThematicMap/helpers/thematicMapHelpers';
import { BenchmarkComparisonMethod } from '@/generated-sources/ft-api-client/models/BenchmarkComparisonMethod';
import { IndicatorPolarity } from '@/generated-sources/ft-api-client/models/IndicatorPolarity';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { ThematicMapCredits } from './ThematicMapCredits';
import { useMapGeographyData } from '@/components/charts/ThematicMap/hooks/useMapGeographyData';
import { H3 } from 'govuk-react';
import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';
import { ExportOptionsButton } from '@/components/molecules/Export/ExportOptionsButton';
import { ExportOnlyWrapper } from '@/components/molecules/Export/ExportOnlyWrapper';
import { ExportCopyright } from '@/components/molecules/Export/ExportCopyright';
import { ChartTitle } from '@/components/atoms/ChartTitle/ChartTitle';
import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';
import { getMethodsAndOutcomes } from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { ThematicMapTooltip } from '@/components/charts/ThematicMap/ThematicMapTooltip';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';
import { Frequency, PeriodType } from '@/generated-sources/ft-api-client';

interface ThematicMapProps {
  name?: string;
  healthIndicatorData: HealthDataForArea[];
  selectedAreaType?: string;
  areaCodes: string[];
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  periodType: PeriodType;
  frequency: Frequency;
  englandData?: HealthDataForArea;
  groupData?: HealthDataForArea;
  indicatorMetadata?: IndicatorDocument;
  benchmarkToUse?: string;
}

export function ThematicMap({
  name,
  healthIndicatorData,
  selectedAreaType,
  areaCodes,
  benchmarkComparisonMethod,
  polarity,
  periodType,
  frequency,
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
    return null;
  }

  const indicatorName = name ?? indicatorMetadata.indicatorName;
  const title = thematicMapTitle(
    indicatorName,
    selectedAreaType,
    groupData,
    healthIndicatorData,
    periodType,
    frequency
  );

  const legendsToShow = getMethodsAndOutcomes([
    { benchmarkComparisonMethod, polarity },
  ]);

  return (
    <>
      <H3 id={ChartTitleKeysEnum.ThematicMap}>
        {chartTitleConfig[ChartTitleKeysEnum.ThematicMap].title}
      </H3>
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
          <BenchmarkLegends
            legendsToShow={legendsToShow}
            title={`Compared to ${healthIndicatorData.at(0)?.healthData.at(0)?.benchmarkComparison?.benchmarkAreaName}`}
            svg
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
